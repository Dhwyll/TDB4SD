// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
const db = require("../models");
const SqlString = require('sqlstring');
const { QueryTypes } = require('sequelize');


// Routes
// =============================================================
module.exports = function(app) {

	// GET route for Carousel information
	app.get("/api/Carousel", (req, res) => {
		let sqlQuery = "SELECT Carousels.Production_Title, " +
			"Carousels.Open_Date, " +
			"Carousels.Close_Date, " +
			"Carousels.Info, " +
			"Carousels.URL, " +
			"Carousels.Image " +
			"FROM Carousels " +
			"WHERE (Open_Date <= (NOW() + INTERVAL 28 DAY) AND (Close_Date >= SUBTIME(NOW(), '1 8:0:0'))) " +
			"ORDER BY Carousels.Close_Date, Carousels.Production_Title";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for Calendar information
	app.get("/api/Calendar", (req, res) => {

	});

	// GET route for getting all of the Productions
	app.get("/api/Production", ( req, res ) => {
		// Retrieve all of the Productions from the database and res.json them back to the user
		console.log("In get Production");
		let sqlQuery = "SELECT Production_Names.ID AS 'Production_ID', " +
			"Production_Names.production AS 'Title', " +
			"Theatre_Names.theatre AS 'Theatre', " +
			"Production_Names.Open_Date " +
			"FROM Production_Names, " +
			"Theatre_Names " +
			"WHERE (Production_Names.production LIKE '%";
		let searchTerm = SqlString.escape(req.query.title);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += "%') AND (Production_Names.Theatre_ID = Theatre_Names.ID) " +
			"ORDER BY Production_Names.Open_Date DESC";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				console.log("Results of query");
				console.log(data);
				res.json(data);
			});
	});

	// GET route for getting the entry for the specific Production given the ID
	app.get("/api/ProductionID", ( req, res ) => {
		// Retrieve all of the Productions from the database and res.json them back to the user
		let sqlQuery = "SELECT Production_Names.ID AS 'Production_ID', " +
			"Production_Names.production AS 'Title', " +
			"Theatre_Names.theatre AS 'Theatre', " +
			"Production_Names.Open_Date " +
			"FROM Production_Names, " +
			"Theatre_Names " +
			"WHERE (Production_Names.ID = ";
			let searchTerm = SqlString.escape(req.query.searchID);
			searchTerm = searchTerm.substring(1, searchTerm.length - 1);
			sqlQuery += searchTerm;
			sqlQuery += ") AND (Production_Names.Theatre_ID = Theatre_Names.ID) " +
			"ORDER BY Production_Names.Open_Date";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Production Details
	app.get("/api/ProductionDetails", ( req, res ) => {
		// Retrieve all of the Production Results from the database and res.json them back to the user
		let sqlQuery = "SELECT Production_Names.ID as 'Production_ID', " +
			"Production_Names.Production AS 'Title', " +
			"Productions.Open_Date," +
			"Productions.Close_Date, " +
			"Productions.Num_Performances, " +
			"Theatre_Names.Theatre as 'Theatre', " +
			"Theatre_Names.ID as 'Theatre_ID'," +
			"People_Names.Name as 'Name', " +
			"People_Names.ID as 'Person_ID', " +
			"Position_Names.Position as 'Position', " +
			"Productions.Role FROM Productions, " +
			"Production_Names, Theatre_Names, " +
			"People_Names, Position_Names " +
			"WHERE (Productions.Production_ID = ";
		let searchTerm = SqlString.escape(req.query.productionID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += ") AND (Productions.Production_ID = Production_Names.ID) " +
			"AND (Productions.Theatre_ID = Theatre_Names.ID) " +
			"AND (Productions.Person_ID = People_Names.ID) " +
			"AND (Productions.Position_ID = Position_Names.ID) " +
			"ORDER BY People_Names.Last_Name, People_Names.Name, Position_Names.Position, Productions.Role";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Persons
	app.get("/api/Person", ( req, res ) => {
		// Retrieve all of the Persons from the database and res.json them back to the user
		let sqlQuery = "SELECT People_Names.ID AS 'Person_ID', " +
			"People_Names.Name AS 'Name' " +
			"FROM People_Names " +
			"WHERE People_Names.Name LIKE '%";
		let searchTerm = SqlString.escape(req.query.searchName);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += "%' ORDER BY People_Names.Last_Name, People_Names.Name";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting the entry for the specific Person given the ID
	app.get("/api/PersonID", ( req, res ) => {
		// Retrieve the Person matching the ID from the database and res.json them back to the user
		let sqlQuery = "SELECT People_Names.ID AS 'Person_ID', " +
			"People_Names.Name AS 'Name' " +
			"FROM People_Names " +
			"WHERE People_Names.ID = ";
		let searchTerm = SqlString.escape(req.query.searchID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += " ORDER BY People_Names.Last_Name, People_Names.Name";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Person Details
	app.get("/api/PersonDetails", ( req, res ) => {
		// Retrieve all of the Production Results from the database and res.json them back to the user
		let sqlQuery = "SELECT Position_Names.Position AS 'Position', " +
			"Productions.Role, " +
			"Production_Names.Production AS 'Title', " +
			"Productions.Production_ID AS 'Production_ID', " +
			"Theatre_Names.Theatre AS 'Theatre', " +
			"Theatre_Names.ID AS 'Theatre_ID', " +
			"Productions.Open_Date " +
			"FROM Productions, " +
			"Production_Names, Theatre_Names, " +
			"People_Names, Position_Names " +
			"WHERE (Productions.Person_ID = ";
		let searchTerm = SqlString.escape(req.query.personID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += ") AND (Productions.production_ID = Production_Names.ID) " +
			"AND (Productions.Theatre_ID = Theatre_Names.ID) " +
			"AND (Productions.Person_ID = People_Names.ID) " +
			"AND (Productions.Position_ID = Position_Names.ID) " +
			"ORDER BY Productions.Open_Date DESC, Position";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Theatres
	app.get("/api/Theatre", ( req, res ) => {
		// Retrieve all of the Theatres from the database and res.json them back to the user
		let sqlQuery =  "SELECT Theatre_Names.ID as 'Theatre_ID', " +
			"Theatre_Names.Theatre as 'Theatre' " +
			"FROM Theatre_Names " +
			"WHERE Theatre_Names.Theatre LIKE '%";
		let searchTerm = SqlString.escape(req.query.theatreName);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += "%' ORDER BY Theatre_Names.Theatre";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting the entry for the specific Theatre given the ID
	app.get("/api/TheatreID", ( req, res ) => {
		// Retrieve all of the Theatres from the database and res.json them back to the user
		let sqlQuery =  "SELECT Theatre_Names.ID as 'Theatre_ID', " +
			"Theatre_Names.Theatre as 'Theatre' " +
			"FROM Theatre_Names " +
			"WHERE Theatre_Names.ID = ";
		let searchTerm = SqlString.escape(req.query.searchID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += " ORDER BY Theatre_Names.Theatre";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Theatre Details
	app.get("/api/TheatreDetails", ( req, res ) => {
		// Retrieve all of the Production Results from the database and res.json them back to the user
		let sqlQuery = "SELECT Production_Names.Production as 'Title', " +
			"Production_Names.ID AS 'Production_ID', " +
			"Production_Names.Open_Date, " +
			"Production_Names.Close_Date " +
			"FROM Production_Names " +
			"WHERE (Production_Names.Theatre_ID = ";
		let searchTerm = SqlString.escape(req.query.theatreID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += ") ORDER BY Production_Names.Open_Date DESC";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Productions for a specific Year
	app.get("/api/Year", ( req, res ) => {
		// Retrieve all of the Productions from the database and res.json them back to the user
		let sqlQuery = "SELECT Production_Names.ID AS 'Production_ID', " +
			"Production_Names.Production AS 'Title', " +
			"Theatre_Names.Theatre AS 'Theatre', " +
			"Production_Names.Open_Date " +
			"FROM Production_Names, " +
			"Theatre_Names " +
			"WHERE (Production_Names.Open_Date LIKE '";
		let searchTerm = SqlString.escape(req.query.year);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += "%') AND (Production_Names.Theatre_ID = Theatre_Names.ID) " +
			"ORDER BY Production_Names.Open_Date";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all Awards for a particular Production
	app.get("/api/ProductionAwards", ( req, res ) => {
		let sqlQuery = "SELECT Production_Names.ID AS 'Production_ID', " +
			"Production_Names.Production AS 'Title', " +
			"Theatre_Names.ID AS 'Theatre_ID', " +
			"Theatre_Names.Theatre AS 'Theatre', " +
			"Award_Names.ID AS 'Award_ID', " +
			"Award_Names.Awards AS 'Award', " +
			"Award_Types.ID AS 'Category_ID', " +
			"Award_Types.Category AS 'Category', " +
			"People_Names.ID AS 'Person_ID', " +
			"People_Names.Name AS 'Name', " +
			"Awards.Won AS 'Won' " +
			"FROM Production_Names, " +
			"Theatre_Names, " +
			"Award_Names, " +
			"Award_Types, " +
			"Awards " +
			"LEFT JOIN People_Names " +
			"ON Awards.Person_ID = People_Names.ID " +
			"WHERE (Awards.Production_ID = ";
		let searchTerm = SqlString.escape(req.query.productionID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += ") AND (Awards.production_ID = Production_Names.ID) " +
			"AND (Awards.Theatre_ID = Theatre_Names.ID) " +
			"AND (Awards.Award_ID = Award_Names.ID) " +
			"AND (Awards.Category_ID = Award_Types.ID) " +
			"AND (Awards.Person_ID = People_Names.ID OR Awards.Person_ID IS NULL) " +
			"ORDER BY Award_ID, Category_ID, Won, People_Names.Last_Name, Name";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, netadata) {
				res.json(data);
			});	
	});

	// GET route for getting all Awrads for a particular Person
	app.get("/api/PersonAwards", ( req, res) => {
		let sqlQuery = "SELECT Production_Names.ID AS 'Production_ID', " +
			"Production_Names.Production AS 'Title', " +
			"Theatre_Names.ID AS 'Theatre_ID', " +
			"Theatre_Names.Theatre AS 'Theatre', " +
			"Awards.Award_Date AS 'Award_Date', " +
			"Award_Names.ID AS 'Award_ID', " +
			"Award_Names.Awards AS 'Award', " +
			"Award_Types.ID AS 'Category_ID', " +
			"Award_Types.Category AS 'Category', " +
			"People_Names.ID AS 'Person_ID', " +
			"People_Names.Name AS 'Name', " +
			"Awards.won AS 'Won' " +
			"FROM Production_Names, " +
			"Theatre_Names, " +
			"Award_Names, " +
			"Award_Types, " +
			"People_Names, " +
			"Awards " +
			"WHERE (Awards.Person_ID = ";
		let searchTerm = SqlString.escape(req.query.personID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += ") AND (Awards.production_ID = Production_Names.ID) " +
			"AND (Awards.Theatre_ID = Theatre_Names.ID) " +
			"AND (Awards.award_ID = Award_Names.ID) " +
			"AND (Awards.category_ID = Award_Types.ID) " +
			"AND (Awards.person_ID = People_Names.ID) " +
			"ORDER BY Award, Award_Date DESC, Won DESC, Category";
		db.sequelize.query(sqlQuery, { type: QueryTypes.SELECT})
			.then(function(data, netadata) {
				res.json(data);
			});	

	});
};
