const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Router = require("./routers");
const path=require('path')
// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Initialize Express
const app = express();

// MongoDB connection URI from environment variables
const dbURI = process.env.MONGODB_URI;

// Port from environment variables, default to 5000 if not specified
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(Router);


//static files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*",function(req,res) {
  res.sendFile(path.join(__dirname,"./client/build/index.html"));
});

// MongoDB connection
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Start the Express server after successfully connecting to MongoDB
    app.listen(port, () => {
      console.log(`Connected to MongoDB and listening at port ${port}`);
    });
  })
  .catch((err) => console.error(err));

// Additional production configuration
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
