require("dotenv").config();
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
    try {
        
        if (!authorization || !authorization.startsWith("Bearer")) {
            return next(
            new ErrorResponse("A token is required for authorization", 401)
            );
        }

        const token = authorization.split(" ")[1];
        const validated = jwt.verify(token, process.env.JWT_SECRET);

        if (!validated) {
            return next(
            new ErrorResponse("Invalid token, please login and try again", 401)
            );
        }

        const user = await User.findOne({ _id: validated.id });
        if (!user) {
            return next(new ErrorResponse("No user found with this id", 401));
        }
        req.user = user
        next();

    } catch (error) {
        return next(error)        
    }
};
