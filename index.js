const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const upload = require("express-fileupload");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const moment = require("moment");
const passport = require("passport");
mongoose.Promise = global.Promise;

const { mongoDbUrl } = require("./config/database.js");
const homeRoutes = require("./routes/homeRoutes/index.js");
const adminRoutes = require("./routes/adminRoutes/index.js");
const posts = require("./routes/adminRoutes/posts.js");
const categories = require("./routes/adminRoutes/categories.js");

app.use(upload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const { select, dateConverter } = require("./utils/handlebars.js");

app.engine(
  "handlebars",
  engine({ defaultLayout: "home", helpers: { select, dateConverter } })
);
app.set("view engine", "handlebars");

app.use("/", homeRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/posts", posts);
app.use("/admin/categories", categories);

app.use(
  session({
    secret: "meiti",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user || "";
  res.locals.successMessage = req.flash("success-message");
  res.locals.errorMessage = req.flash("error-message");
  res.locals.error = req.flash("error");
  next();
});

mongoose
  .connect(mongoDbUrl)
  .then((db) => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3008, () => {
  console.log("listening...");
});
