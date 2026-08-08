const express = require('express');

module.exports = (db) => {
  const router = express.Router();
  router.use('/members', require('./members')(db));
  router.use('/attendance', require('./attendance')(db));
  router.use('/payments', require('./payments')(db));
  router.use('/', require('./submitPayment')(db));
  router.use('/', require('./uploadReceipt')());
  return router;
};
