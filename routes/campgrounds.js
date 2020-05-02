var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/about", function(req, res){
    res.render("about");
});

router.get("/", function(req, res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch=null;
    if(req.query.search){
         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
         Campground.find({name: regex}).sort({ "createdAt": -1 }).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.countDocuments({name: regex}).exec(function (err, count) {
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(allCampgrounds.length <1){
                    noMatch = "No Matching Records Found, Try Another Keyword";
                }
                res.render("campgrounds/index",{
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: req.query.search
                    });
                }
            });
        });
        
    }else{
    Campground.find({}).sort({ "createdAt": -1 }).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.estimatedDocumentCount().exec(function (err, count) {
       if(err){
           console.log(err);
       } else {
                res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});

    router.post("/", middleware.isLoggedIn, function(req, res) {
    
    if(req.body.location.length < 1){
        res.redirect('back');
        }else{
    
    var name = req.body.name;
    var image1 = req.body.image1;
    var image2 = req.body.image2;
    var image3 = req.body.image3;
    var cost = req.body.cost;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    geocoder.geocode(req.body.location, function (err, data) {
	  if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image1: image1, image2: image2, image3: image3, cost: cost, description:desc, author:author, location: location, lat: lat, lng: lng};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});
}
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error","You Don’t Have Permission To Access");
            res.redirect("/campgrounds/");
        } else {
            console.log(foundCampground)
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

router.get("/:id/edit", middleware.checkUserCampground, function(req, res){
    console.log("EDIT!");
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground_id: req.params.id, campground: foundCampground});
        }
    });
});

router.put("/:id", middleware.checkUserCampground, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
	  if (err || !data.length) {
	  req.flash('error', 'Invalid address');
	  return res.redirect('back');
	  }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", "Error Info, Please Try Again");
            res.redirect("/campgrounds");
        } else {
            req.flash("success","Successfully Updated !");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});
});


router.delete("/:id", middleware.checkUserCampground ,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else{
          res.redirect("/campgrounds");
      }
   });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

