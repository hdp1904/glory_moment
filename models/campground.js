var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   // wait to change
   name: String,
   image1: String,

   image3: String,
   image4: String,
   image5: String,
   description: String,
   cost: { type: String, required: true },
   location: String,
   lat: Number,
   lng: Number,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
