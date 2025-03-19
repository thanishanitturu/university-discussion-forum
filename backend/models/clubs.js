const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  logo: {
    data: Buffer,
    contentType: String,
  }, 
  coordinator: { type: String },
  members: [{type:String}],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Club", clubSchema);
