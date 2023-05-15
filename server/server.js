const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = require("./app");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const User = require("./models/user.model");

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGOURI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(port, () => console.log(`Server running on port ${port}`))
  )
  .catch((error) => console.log(error.message));
