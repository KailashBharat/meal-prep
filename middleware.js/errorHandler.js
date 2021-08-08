const ErrorResponse = require("../utils.js/ErrorResponse")

module.exports = (err, req, res, next) =>{
    const {name, message, statusCode} = err

    // If there is no statusCode of err.message given then something went wrong on the server-side
    res.status(statusCode  || 500).json({
        succes: false,
        error: message || "Server error"
    })
}