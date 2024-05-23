const mongoose = require('mongoose');
const { mongoose_cc_backend_conn} = require('../mongooseClient');

const consentIdsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  consentId: {
    type: String,
    required: true
  },
  consent: {
    type: String,
    required: true
  },
  Domain: {
    type: String
  }
});

module.exports = mongoose_cc_backend_conn.model('consentIds', consentIdsSchema);