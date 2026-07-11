// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var session = require("express-session");
var bcrypt = require("bcrypt");
var SequelizeStore = require("connect-session-sequelize")(session.Store);
// removing to adapt to new Express version 5
// var bodyParser = require("body-parser");

// Sets up the Express App
// =============================================================
var app = express();
let PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === "production";
const SESSION_IDLE_TIMEOUT_MS = Number(process.env.SESSION_IDLE_TIMEOUT_MS || 30 * 60 * 1000);
// Requiring our models for syncing
var db = require("./models");
const sessionStore = new SequelizeStore({
  db: db.sequelize,
  tableName: "Sessions",
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: SESSION_IDLE_TIMEOUT_MS
});

// Sets up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.json({ type: "application/vnd.api+json" }));

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required in production.");
}

app.set("trust proxy", 1);

app.use(session({
  name: "tdb4sd.sid",
  secret: process.env.SESSION_SECRET || "tdb4sd-testing-secret",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  proxy: isProduction,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: SESSION_IDLE_TIMEOUT_MS
  }
}));

async function ensureDefaultAdminUser() {
  let username = process.env.TDB4SD_ADMIN_USERNAME;
  let password = process.env.TDB4SD_ADMIN_PASSWORD;

  if (!username || !password) {
    if (isProduction) {
      throw new Error("TDB4SD_ADMIN_USERNAME and TDB4SD_ADMIN_PASSWORD are required in production.");
    }

    username = username || "admin";
    password = password || "changeMe123!";
  }

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
  await sessionStore.sync();
  await ensureDefaultAdminUser();
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
}).catch(function(err) {
  console.error("CRITICAL ERROR: Sequelize sync failed!");
  console.error(err);
  process.exit(1); // This ensures Heroku logs the error and stops the crash loop
});
