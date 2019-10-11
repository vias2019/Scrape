const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },  
  link: {
    type: String,
    required: true
  },
  note: {
    type: String
   
  },
  ifSaved: {
    type: String,
    default: true
  }

});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
