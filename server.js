require("dotenv").config();
const express = require("express");
const axios = require("axios")

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(require("./routes.js/foods"))

// When using errorHandler middleware, it always needs to be initialized at the bottom
app.use(require("./middleware.js/errorHandler"))

app.listen(process.env.PORT, (req, res) => {
  console.log(`Listening on port ${process.env.PORT}`);
});
