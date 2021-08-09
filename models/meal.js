const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const foodSchema = mongoose.Schema({
  meals: [{
    type: Number,
  }],
  user: {
      ref: "User",
      type: ObjectId
  }
});


const Food = mongoose.model("Food", foodSchema)
module.exports = Food