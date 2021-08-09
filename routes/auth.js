const express = require("express");

const router = express.Router();

const User = require("../models/user");
const ErrorResponse = require("../utils/ErrorResponse");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth")

router.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(
        new ErrorResponse("User with that email already exists", 401)
      );
    }

    const user = await User.create({ username, password, email });
    return res.status(200).json({
      succes: true,
      message: `Hi ${username}, your profile has been succesfully created`,
    });
  } catch (error) {
    return next(new ErrorResponse("Something went wrong creating a user"));
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please fill in all the fields"), 401);
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials, couldn't login"));
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return next(
        new ErrorResponse("Incorrect Credentials, couldn't login", 401)
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ succes: true, message: "Succesfully loged in", token: token });
  } catch (error) {
    return next(new ErrorResponse("Login failed", 500));
  }
});

router.get("/protected", auth, (req, res, next)=>{
    res.json("welcome to protected route")
});

module.exports = router;

// register{
//     "username": "Kbharat1",
//     "email": "Kailashbb12@hotmail.com",
//     "password": "Kbharat1"
// }
