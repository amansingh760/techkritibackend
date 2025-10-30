const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  serialNumber: Number,
  name: String,
  email: String,
  mobile_number: Number,
  college: String,
  department: String,
  year: Number,
  events: [String],
  utr : String,
  image: {
    data: Buffer,
    contentType: String
  }
},
{versionKey: false  // disables __v
});

module.exports = mongoose.model('Registration', registrationSchema);
