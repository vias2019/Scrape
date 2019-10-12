var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require('path');
var exphbs =require('express-handlebars');
var axios = require("axios");
var cheerio = require("cheerio");


var db = require("./models");

var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://vias2019:cat123<dbpassword>@ds333238.mlab.com:33238/heroku_5rbpc8rk";
var app = express();

app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Configure middleware

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { 
  useUnifiedTopology: true,
  useNewUrlParser: true });

// Routes
app.get("/", function(req, res) {
  res.render('index',{articles: []});
});

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://nytimes.com/section/science/").then(function (response) {
    var $ = cheerio.load(response.data);
    var results = [];
  var max=4;
    //$("div.css-10wtrbd").each(function (i, element) {
      $("div.css-10wtrbd").each(function (i, element) {
        
        var title = $(element).find("h2.css-l2vidh").text();//.split(",")[0].split(" ")[0];
        //var summary=$(element).find("p.e1xdw535").text();//.split(",")[0].split(" ")[0];
        //var summary=$(element).find("p.e4e4i5l4").text();//.split(",")[0].split(" ")[0];
        var summary=$(element).find("p.css-1gh531").text();//.split(",")[0].split(" ")[0];
        var link =$(element).find("a").attr("href");//.attr("data-rref").split(",")[0].split(" ")[0];
        if(i<max){
        results.push({
            title: title,
            summary: summary,
            link: link,
            ifNewArticle: true
        });
        }
    });
    
    console.log(results);
      res.render('index',{articles: results});
   
    });
    //res.send("Scrape Complete");
   

  
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
    
  db.Article.find({})
    .then(function(dbscrape) {
      console.log(dbscrape);
      // If we were able to successfully find Articles, send them back to the client
      res.render('index',{articles: dbscrape});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.delete("/articles", function(req, res) {
  // Grab every document in the Articles collection
    console.log(req.body._id);
  db.Article.findByIdAndDelete(
    req.body._id
  )
    .then(function(dbscrape) {
     // db.Article.remove(req.body._id);
      // If we were able to successfully find Articles, send them back to the client
      res.sendStatus(200);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.post("/articles", function(req, res) { //save
  // Grab every document in the Articles collection
db.Article.findOne(
  {title:req.body.title }, function(err, obj)
    {
      if (obj) {
       console.log("Done");
       res.json({msg: 'Article already exists'});
      } else {
      console.log("the value"+req.body);
        db.Article.create(req.body)
        .then(function(dbscrape) {
          // If we were able to successfully find Articles, send them back to the client
          console.log(dbscrape);
          res.render('index',{articles: dbscrape});
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
      }
    }
  );
});

app.patch("/articles/:id", function (req, res) {
  console.log(req.body);
  console.log(req.params.id);
  db.Article.findByIdAndUpdate(req.params.id, {note: req.body.note})
    .then(function (savedNote) {
      // db.Article.remove(req.body._id);
      // If we were able to successfully find Articles, send them back to the client
      //res.sendStatus(200);
      res.send({note:savedNote});

    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
