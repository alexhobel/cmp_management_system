const mongoose = require('mongoose');
let mongoose_cc_backend_conn = mongoose.createConnection('mongodb://127.0.0.1:27017/cc_backend', { useNewUrlParser: true, useUnifiedTopology: true });
let mongoose_cc_management_conn = mongoose.createConnection('mongodb://127.0.0.1:27017/cc_management_system', { useNewUrlParser: true, useUnifiedTopology: true });
module.exports = {
    mongoose_cc_backend_conn,
    mongoose_cc_management_conn
};