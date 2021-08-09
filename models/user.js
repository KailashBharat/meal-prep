const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const ErrorResponse = require("../utils/ErrorResponse")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add in a username"]
    },
    email:{
        type: String,
        uniqe: true,
        required: [true, "Please add an email"],
        match:[
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            "Please provide a valid email",
          ]
    }, 
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,

    }
})


userSchema.pre("save", async function (next){
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

// When using shema methods, it's important to define the model at the bottom
const User = mongoose.model("User", userSchema)
module.exports = User