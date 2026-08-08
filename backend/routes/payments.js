const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.all('SELECT * FROM payments ORDER BY recorded_at DESC', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.post('/', (req, res) => {
    const { member_id, payment_date, amount, method, receipt, status } = req.body;
    db.run(
      'INSERT INTO payments (member_id, payment_date, amount, method, receipt, status) VALUES (?, ?, ?, ?, ?, ?)',
      [member_id, payment_date, amount, method, receipt, status],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, created: true });
      }
    );
  });

  return router;
};
