var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

router.post("/",middleware.isLoggedIn,function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(error);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.unshift(comment);
               campground.save();
               console.log(comment);
               req.flash('success', 'Added Successfully');
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.checkUserComment, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if (err || !campground) {
        req.flash("error", "Permission Denied");
        res.redirect("/campgrounds/" + req.params.id);
        }
        Comment.findById(req.params.commentId, function(error, comment){
           if(error){
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
      });
    });
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
           res.render("edit");
           console.error(err);
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("error");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;
