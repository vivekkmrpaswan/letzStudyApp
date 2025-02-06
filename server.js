const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const methodOverride = require("method-override");
const path = require("path");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
connectDB();

require("./config/passport")(passport);
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "admin@123",
    resave: false,
    saveUninitialized: false,
    cookie:{secure:false, maxAge:24*60*60*1000}//1 day
  })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
// TODO: Add routes here

app.use("/", require("./routes/indexRoute"));
app.use("/auth", require("./routes/auth"));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
