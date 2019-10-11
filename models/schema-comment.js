const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var CommentSchema = new Schema({
    title: {
        type: String,
    },
    body: String
});

var Note = mongoose.model("Note", CommentSchema);
module.exports = Note;
