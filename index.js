const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressHandlebars = require("express-handlebars");
const app = express();

const mainRoutes = require("./routes/home/main.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", expressHandlebars({ defaultLayout: "home" }));
app.set("view engine", "handlebars");

app.use("/", mainRoutes);

app.listen(3008, () => {
  console.log("listening...");
});
