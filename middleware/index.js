var Comment = require("../models/comment");
var Campground = require("../models/campground");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){

        }
        req.flash("error", "You Must Be Logged In To Access The Page.");
        res.redirect("/login");
    },
    checkUserCampground: function(req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, campground){
            if(err || !campground){
               req.flash("error", "You Don’t Have Permission To Access");
               res.redirect("/campgrounds/");
           }  else {
            if(campground.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You Must Be Logged In To Access That Page.");
                res.redirect("/login");
            }
        }
    });
        } else {
        req.flash("error", "You Must Be Logged In To Access That Page.");
        res.redirect("/login");
    }
},

    checkUserComment: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
                if(err|| !comment){
               req.flash("error", "You Don’t Have Permission To Access");    
               res.redirect("/campgrounds/" + req.params.id);
           }  else {
            if(comment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You Don’t Have Permission To Access!");
                res.redirect("/campgrounds/" + req.params.id);
            }
           }
        });
    } else {
        req.flash("error", "You Must Be Logged In To Access That Page.");
        res.redirect("/login");
        }
    }
}
