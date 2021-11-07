const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  createdby:{
    type: String,
    required: true
  }
});

const Contact = mongoose.model('Todo', contactSchema);

module.exports = Contact;