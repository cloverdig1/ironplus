const express = require('express');

const ALLOWED_PAYMENT_METHODS = ['bank', 'telebirr', 'card'];
const ALLOWED_BANK_CODES = ['cbe', 'dashen', 'awash', 'boa', 'zemen'];
const planDurations = {
  'Basic Monthly': 30,
  'Student Plan': 30,
  'Standard Quarterly': 90,
  'Premium Annual': 365,
};

function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function normalizeAmount(value) {
  if (value == null) return null;
  const numeric = typeof value === 'string' ? value.replace(/,/g, '').trim() : value;
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : null;
}

function sanitizeText(value) {
  if (value == null) return '';
  return String(value).trim().slice(0, 250);
}

function findMemberByPhone(db, phone) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM members WHERE phone = ?', [phone], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function createGuestMember(db, payload) {
  return new Promise((resolve, reject) => {
    const id = `GUEST-${Date.now()}`;
    const registrationDate = new Date().toISOString().slice(0, 10);
    db.run(
      `INSERT INTO members (id, name, phone, status, plan, registration_date, expiry_date, last_updated)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        id,
        payload.customer_name || 'Guest',
        payload.customer_phone || '',
        'pending',
        payload.plan || 'Unknown',
        registrationDate,
        addDays(registrationDate, planDurations[payload.plan] || 30),
      ],
      function (err) {
        if (err) return reject(err);
        resolve({ id, plan: payload.plan, status: 'pending', expiry_date: addDays(registrationDate, planDurations[payload.plan] || 30) });
      }
    );
  });
}

function insertPayment(db, payment) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO payments (member_id, payment_date, amount, method, receipt, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        payment.member_id,
        payment.payment_date,
        payment.amount,
        payment.method,
        payment.receipt,
        payment.status,
      ],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

function updatePaymentStatus(db, paymentId, status) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE payments SET status = ? WHERE id = ?', [status, paymentId], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function updateMemberMembership(db, memberId, plan) {
  return new Promise((resolve, reject) => {
    db.get('SELECT expiry_date, status FROM members WHERE id = ?', [memberId], (err, member) => {
      if (err) return reject(err);
      if (!member) return reject(new Error('Member not found'));
      const days = planDurations[plan] || 30;
      const now = new Date();
      const expiryBase = member.expiry_date && new Date(member.expiry_date) > now ? member.expiry_date : now.toISOString().slice(0, 10);
      const nextExpiry = addDays(expiryBase, days);
      db.run(
        'UPDATE members SET status = ?, expiry_date = ?, plan = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?',
        ['active', nextExpiry, plan, memberId],
        (err) => {
          if (err) return reject(err);
          resolve(nextExpiry);
        }
      );
    });
  });
}

module.exports = (db) => {
  const router = express.Router();

  router.post('/submit-payment', async (req, res) => {
    const payload = req.body || {};
    const method = sanitizeText(payload.payment_method || 'bank').toLowerCase();
    const expectedAmount = normalizeAmount(payload.expected_amount);
    const plan = sanitizeText(payload.plan);
    const reference = sanitizeText(payload.reference);
    const account = sanitizeText(payload.account);
    const customerName = sanitizeText(payload.customer_name);
    const customerPhone = sanitizeText(payload.customer_phone);
    const accountHolderName = sanitizeText(payload.account_holder_name);

    if (!plan) {
      return res.status(400).json({ error: 'Missing required field: plan' });
    }
    if (expectedAmount == null || expectedAmount <= 0) {
      return res.status(400).json({ error: 'Expected amount must be a positive number' });
    }
    if (!ALLOWED_PAYMENT_METHODS.includes(method)) {
      return res.status(400).json({ error: 'Invalid payment_method' });
    }
    if (!customerName) {
      return res.status(400).json({ error: 'Missing required field: customer_name' });
    }
    if (!customerPhone) {
      return res.status(400).json({ error: 'Missing required field: customer_phone' });
    }

    if (method === 'bank') {
      if (!payload.bank_code || !ALLOWED_BANK_CODES.includes(payload.bank_code)) {
        return res.status(400).json({ error: 'Invalid bank_code' });
      }
      if (!reference) {
        return res.status(400).json({ error: 'Bank reference is required for bank transfers' });
      }
      if (payload.bank_code === 'cbe' && !account) {
        return res.status(400).json({ error: 'CBE FT transfers require the sending account number' });
      }
      if (!accountHolderName) {
        return res.status(400).json({ error: 'Account holder name is required for bank transfers' });
      }
    }

    if (method === 'telebirr') {
      if (!reference) {
        return res.status(400).json({ error: 'Telebirr receipt ID or link is required' });
      }
      if (!payload.account) {
        return res.status(400).json({ error: 'Telebirr phone number is required' });
      }
    }

    if (method === 'card') {
      if (!payload.screenshot_url && !reference) {
        return res.status(400).json({ error: 'Card payments need either a receipt link or attachment' });
      }
    }

    try {
      let member = null;
      if (payload.member_id) {
        member = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM members WHERE id = ?', [payload.member_id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
          });
        });
      }

      const phone = payload.customer_phone || '';
      if (!member && phone) {
        member = await findMemberByPhone(db, phone);
      }

      if (!member) {
        member = await createGuestMember(db, payload);
      }

      const sanitizedMethod = method;
      const paymentDate = new Date().toISOString().slice(0, 10);
      const paymentId = await insertPayment(db, {
        member_id: member.id,
        payment_date: paymentDate,
        amount: expectedAmount,
        method: sanitizedMethod,
        receipt: payload.screenshot_url || reference,
        status: 'pending_verification',
      });

      let finalStatus = 'needs_review';
      let verifyResult = null;
      if (method === 'bank' || method === 'telebirr') {
        const verifyUrl = process.env.VERIFY_SERVICE_URL || 'http://localhost:5000/verify';
        const verifyResponse = await fetch(verifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bank: method === 'telebirr' ? 'tele' : payload.bank_code,
            reference,
            account: account || undefined,
            expected_amount: expectedAmount,
            member_id: member.id,
            payment_method: method,
          }),
        });

        if (!verifyResponse.ok) {
          await updatePaymentStatus(db, paymentId, 'needs_review');
          return res.status(202).json({ status: 'needs_review', message: 'Verification service is unavailable.' });
        }

        verifyResult = await verifyResponse.json();
        finalStatus = verifyResult.status === 'paid' ? 'paid' : 'needs_review';
      } else {
        verifyResult = { status: 'needs_review', reason: 'manual_review_required' };
      }

      await updatePaymentStatus(db, paymentId, finalStatus);
      if (finalStatus === 'paid') {
        await updateMemberMembership(db, member.id, plan);
      }

      return res.status(200).json({
        payment_id: paymentId,
        status: finalStatus,
        verified_amount: verifyResult?.extracted_amount ?? null,
        verified_payer_name: verifyResult?.payer_name || null,
        verification: verifyResult,
      });
    } catch (error) {
      console.error('submit-payment error:', error);
      return res.status(500).json({ error: error.message || 'Unable to submit payment.' });
    }
  });

  return router;
};
