// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var session = require("express-session");
var bcrypt = require("bcrypt");
// removing to adapt to new Express version 5
// var bodyParser = require("body-parser");

// Sets up the Express App
// =============================================================
var app = express();
let PORT = process.env.PORT || 8080;
// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.json({ type: "application/vnd.api+json" }));

app.use(session({
  secret: process.env.SESSION_SECRET || "tdb4sd-testing-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: true }
}));

async function ensureDefaultAdminUser() {
  const username = process.env.TDB4SD_ADMIN_USERNAME || "admin";
  const password = process.env.TDB4SD_ADMIN_PASSWORD || "changeMe123!";

  const existing = await db.Admin_User.findOne({ where: { username } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.Admin_User.create({ username, passwordHash });
  }
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAuthenticated && req.session.username) {
    return next();
  }

  res.status(401).json({ error: "Unauthorized" });
}

app.use(express.static("public"));

// Routes
// =============================================================
require("./routes/api-routes.js")(app);
require("./routes/admin-routes.js")(app, db, requireAdmin);
console.log("Admin routes loaded successfully");

// app.get('*', (request, response) => {
// 	response.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(async function() {
  await ensureDefaultAdminUser();
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
}).catch(function(err) {
  console.error("CRITICAL ERROR: Sequelize sync failed!");
  console.error(err);
  process.exit(1); // This ensures Heroku logs the error and stops the crash loop
});
