const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.all('SELECT * FROM members ORDER BY name COLLATE NOCASE', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.get('/:id', (req, res) => {
    db.get('SELECT * FROM members WHERE id = ?', [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Member not found' });
      res.json(row);
    });
  });

  router.post('/', (req, res) => {
    const {
      id,
      name,
      gender,
      dob,
      phone,
      emergency_contact,
      address,
      registration_date,
      status,
      expiry_date,
      plan,
      trainer,
      locker,
      medical_notes
    } = req.body;

    const query = `INSERT INTO members (
      id, name, gender, dob, phone, emergency_contact, address,
      registration_date, status, expiry_date, plan, trainer, locker, medical_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [
      id,
      name,
      gender,
      dob,
      phone,
      emergency_contact,
      address,
      registration_date,
      status,
      expiry_date,
      plan,
      trainer,
      locker,
      medical_notes
    ], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, created: true });
    });
  });

  router.put('/:id', (req, res) => {
    const fields = [];
    const values = [];

    Object.entries(req.body).forEach(([key, value]) => {
      if (['name','gender','dob','phone','emergency_contact','address','registration_date','status','expiry_date','plan','trainer','locker','medical_notes'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (!fields.length) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    values.push(req.params.id);
    const query = `UPDATE members SET ${fields.join(', ')}, last_updated = CURRENT_TIMESTAMP WHERE id = ?`;

    db.run(query, values, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Member not found' });
      res.json({ id: req.params.id, updated: true });
    });
  });

  router.delete('/:id', (req, res) => {
    db.run('DELETE FROM members WHERE id = ?', [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Member not found' });
      res.json({ id: req.params.id, deleted: true });
    });
  });

  return router;
};
