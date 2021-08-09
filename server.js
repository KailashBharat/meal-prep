require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connecting to local DB
mongoose.connect("mongodb://localhost:27017/User", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", console.error.bind(console, "connection error: "))
mongoose.connection.once("open", ()=>{
    console.log("Connected to local User DB")
})


app.use(require("./routes/foods"));
app.use(require("./routes/auth"))

// When using errorHandler middleware, it always needs to be initialized at the bottom
app.use(require("./middleware/errorHandler"));

app.listen(process.env.PORT, (req, res) => {
  console.log(`Listening on port ${process.env.PORT}`);
});
