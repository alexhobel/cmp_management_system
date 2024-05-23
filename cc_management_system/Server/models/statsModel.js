const mongoose = require('mongoose');
const { mongoose_cc_backend_conn } = require('../mongooseClient');

const statsSchema = mongoose.Schema(
    {
        kundenNr: Number,
        domain: String,
        datum: Date,
        acceptAllChoiceCounts: Number,
        declineChoiceCounts: Number,
        essentialCounts: Number,
        ccmPopupCounts: Number,
        openReconsentMenuCounts: Number,
        reconsentCounts: Number
    },
    {
        collection: 'stats'
    }
);


module.exports = mongoose_cc_backend_conn.model('stats', statsSchema);