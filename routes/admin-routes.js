// *********************************************************************************
// admin-routes.js - routes for the admin interface (login, production entry, account management)
// *********************************************************************************

const bcrypt = require("bcrypt");
const path = require("path");

function renderStaticFile(res, filePath, errorMessage) {
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving ${filePath}:`, err);
      res.status(500).json({ error: errorMessage, details: err.message, path: filePath });
    }
  });
}

module.exports = function(app, db, requireAdmin) {

  // GET /admin - redirect to production entry
  app.get("/admin", function(req, res) {
    res.redirect("/admin/production");
  });

  // GET /admin/login - serve login page
  app.get("/admin/login", function(req, res) {
    const filePath = path.join(__dirname, "..", "public", "admin-login.html");
    renderStaticFile(res, filePath, "Failed to load login page");
  });

  // GET /admin/production - serve production entry page (protected)
  app.get("/admin/production", function(req, res) {
    if (req.session && req.session.isAuthenticated) {
      const filePath = path.join(__dirname, "..", "public", "admin-production.html");
      renderStaticFile(res, filePath, "Failed to load production page");
    } else {
      res.redirect("/admin/login");
    }
  });

  // GET /admin/account - serve account management page (protected)
  app.get("/admin/account", function(req, res) {
    if (req.session && req.session.isAuthenticated) {
      const filePath = path.join(__dirname, "..", "public", "admin-account.html");
      renderStaticFile(res, filePath, "Failed to load account page");
    } else {
      res.redirect("/admin/login");
    }
  });

  // GET /admin/status - check authentication status
  app.get("/admin/status", function(req, res) {
    if (req.session && req.session.isAuthenticated) {
      res.json({ authenticated: true, username: req.session.username });
    } else {
      res.json({ authenticated: false });
    }
  });

  // POST /admin/login - authenticate admin user
  app.post("/admin/login", async function(req, res) {
    try {
      const username = (req.body.username || "").trim();
      const password = (req.body.password || "").trim();

      if (!username || !password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const adminUser = await db.Admin_User.findOne({ where: { username } });
      if (!adminUser) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordMatches = await bcrypt.compare(password, adminUser.passwordHash);
      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.regenerate(function(err) {
        if (err) {
          console.error("Session regeneration failed:", err);
          return res.status(500).json({ error: "Unable to establish session." });
        }

        req.session.isAuthenticated = true;
        req.session.username = username;
        return res.json({ success: true, username });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to process login." });
    }
  });

  // POST /admin/password - change admin password (protected)
  app.post("/admin/password", requireAdmin, async function(req, res) {
    try {
      const username = (req.body.username || "").trim();
      const currentPassword = (req.body.currentPassword || "").trim();
      const newPassword = (req.body.newPassword || "").trim();

      if (!username || !currentPassword || !newPassword) {
        return res.status(400).json({ error: "Username, current password, and new password are required." });
      }

      const adminUser = await db.Admin_User.findOne({ where: { username } });
      if (!adminUser) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const currentMatches = await bcrypt.compare(currentPassword, adminUser.passwordHash);
      if (!currentMatches) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await adminUser.update({ passwordHash });

      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to update password." });
    }
  });

  // POST /admin/production - add a production entry (protected)
  app.post("/admin/production", requireAdmin, async function(req, res) {
    try {
      const title = (req.body.title || "").trim();
      const openDate = (req.body.openDate || "").trim();
      const closeDate = (req.body.closeDate || "").trim();
      const theatreName = (req.body.theatreName || "").trim();
      const fullName = (req.body.fullName || "").trim();
      const lastName = (req.body.lastName || "").trim();
      const positionName = (req.body.positionName || "").trim();
      const role = (req.body.role || "").trim() || null;
      const numPerformances = req.body.numPerformances ? parseInt(req.body.numPerformances, 10) : null;

      if (!title || !theatreName || !fullName || !lastName || !positionName) {
        return res.status(400).json({ error: "Title, theatre, person name, last name, and position are required." });
      }

      const result = await db.sequelize.transaction(async function(t) {
        let theatre = await db.Theatre_Names.findOne({ where: { Theatre: theatreName }, transaction: t });
        if (!theatre) {
          theatre = await db.Theatre_Names.create({ Theatre: theatreName }, { transaction: t });
        }

        let productionName = await db.Production_Names.findOne({
          where: {
            Production: title,
            Theatre_ID: theatre.ID,
            Open_Date: openDate || null,
            Close_Date: closeDate || null
          },
          transaction: t
        });

        if (!productionName) {
          productionName = await db.Production_Names.create({
            Production: title,
            Theatre_ID: theatre.ID,
            Open_Date: openDate || null,
            Close_Date: closeDate || null
          }, { transaction: t });
        }

        let person = await db.People_Names.findOne({
          where: { Name: fullName, Last_Name: lastName },
          transaction: t
        });

        if (!person) {
          person = await db.People_Names.create({
            Name: fullName,
            Last_Name: lastName
          }, { transaction: t });
        }

        let position = await db.Position_Names.findOne({
          where: { Position: positionName },
          transaction: t
        });

        if (!position) {
          position = await db.Position_Names.create({
            Position: positionName
          }, { transaction: t });
        }

        const production = await db.Production.create({
          Production_ID: productionName.ID,
          Open_Date: openDate || null,
          Close_Date: closeDate || null,
          Num_Performances: numPerformances,
          Theatre_ID: theatre.ID,
          Person_ID: person.ID,
          Position_ID: position.ID,
          Role: role
        }, { transaction: t });

        return { theatre, productionName, person, position, production };
      });

      res.json({ success: true, message: "Production entry created successfully.", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Unable to save production entry.", details: error.message });
    }
  });

  // POST /admin/logout - destroy session
  app.post("/admin/logout", function(req, res) {
    req.session.destroy(function() {
      res.json({ success: true });
    });
  });

};
