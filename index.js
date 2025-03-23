const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressHandlebars = require("express-handlebars");
const app = express();

const homeRoutes = require("./routes/homeRoutes/index.js");
const adminRoutes = require("./routes/adminRoutes/index.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", expressHandlebars({ defaultLayout: "home" }));
app.set("view engine", "handlebars");

app.use("/", homeRoutes);
app.use("/admin", adminRoutes);

app.listen(3008, () => {
  console.log("listening...");
});
