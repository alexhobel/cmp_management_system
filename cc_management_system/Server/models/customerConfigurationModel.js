const mongoose = require('mongoose');
const { mongoose_cc_management_conn } = require('../mongooseClient');

const customerConfigurationSchema = new mongoose.Schema({
  configId: String,
  Kundennummer: Number,
  Domain: String,
  farbschema: { type: String , default: "#662d8d"},
  CookieInformation: {
    analyticsGa4: { type: Boolean, default: false },
    googleAds: { type: Boolean, default: false },
    microsoftAdvertising: { type: Boolean, default: false },
    hotjar: { type: Boolean, default: false },
    smartlook: { type: Boolean, default: false },
    linkedIn: { type: Boolean, default: false },
    facebook: { type: Boolean, default: false },
    googleOptimize: { type: Boolean, default: false },
    mailchimp: { type: Boolean, default: false },
    userlike: { type: Boolean, default: false },
    trustedshops: { type: Boolean, default: false }
  },
  logoUrl: String,
  impressumUrl: String,
  datenschutzUrl: String,
  optoutPosition: {
    type: String,
    enum: ['left', 'right']
  },
  frontendStyle: {
    type: String,
    enum: ['v1', 'v2'],
    set: (value) => value.toLowerCase()
  },
  fontColorButtons: {
    type: String,
    enum: ['black', 'white']
  },
  affiliateId: String,
  campaignId: String,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  }
}, 
{
  collection: 'customerConfiguration'
});


const CustomerConfiguration = mongoose_cc_management_conn.model('CustomerConfiguration', customerConfigurationSchema);

module.exports = CustomerConfiguration;
