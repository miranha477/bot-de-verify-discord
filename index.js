require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
require("./discord");
const authRoutes = require("./routes/auth");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static("public"));

app.use(session({
  secret: "verificacao",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/success", (req, res) => {
  res.render("success", { user: req.user });
});

app.listen(3000, () => {
  console.log("🌐 Painel rodando em http://localhost:3000");
});
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Erro ao fazer logout.");
    }
    res.redirect("/");
  });
});