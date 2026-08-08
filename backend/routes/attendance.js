const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.all('SELECT * FROM attendance ORDER BY recorded_at DESC', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.post('/', (req, res) => {
    const { member_id, check_in, check_out, method, branch } = req.body;
    db.run(
      'INSERT INTO attendance (member_id, check_in, check_out, method, branch) VALUES (?, ?, ?, ?, ?)',
      [member_id, check_in, check_out, method, branch],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, created: true });
      }
    );
  });

  return router;
};
