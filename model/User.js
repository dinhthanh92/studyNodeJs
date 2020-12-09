var mongoose = require("mongoose");

var schemapass = new mongoose.Schema({
    username: String,
    password: String,
});
module.exports = mongoose.model("User", schemapass );