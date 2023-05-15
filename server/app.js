const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/letsEndorse/user", userRoutes);

module.exports = app;
