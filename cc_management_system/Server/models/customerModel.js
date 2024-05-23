const mongoose = require('mongoose');
const { mongoose_cc_backend_conn} = require('../mongooseClient');


const customerSchema = new mongoose.Schema({
  UserID: String,
  Whitelabel: {
    type: Boolean,
    default: false
  },
  Kundenname: String,
  Kundennummer: Number,
  PrivacySettingsButton: {
    type: Boolean,
    default: false
  },
  UC_Conv_DatumUebersicht: {
    type: Number,
    default: 0
  },
  url_rating: {
    type: Boolean,
    default: false
  },
  UC_System: {
    type: Boolean,
    default: false
  },
  CustomFrontendVersion_Mipe: {
    type: Boolean,
    default: false
  },
  B2B_partner: {
    type: String,
    default: 'none'
  },
  Domain: {
    type: [String],
    default: []
  },
  customerConfiguration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerConfiguration',
    default: null
  }
}, {
  collection: 'customer'
});

const Customer = mongoose_cc_backend_conn.model('Customer', customerSchema);

module.exports = Customer;

