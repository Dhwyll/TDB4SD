// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");
var SqlString = require('sqlstring');

// Routes
// =============================================================
module.exports = function(app) {

	// GET route for getting all of the Productions
	app.get("/api/Production", ( req, res ) => {
		// Retrieve all of the Productions from the database and res.json them back to the user
		let sqlQuery = "SELECT production_names.ID AS 'Production_ID', " +
			"production_names.Production AS 'Title', " +
			"theatre_names.Theatre AS 'Theatre', " +
			"production_names.Open_Date " +
			"FROM production_names, " +
			"theatre_names " +
			"WHERE (production_names.Production LIKE '%";
		let searchTerm = SqlString.escape(req.query.title);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += "%') AND (production_names.theatre_id = theatre_names.id) " +
			"ORDER BY production_names.Open_Date";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting the entry for the specific Production given the ID
	app.get("/api/ProductionID", ( req, res ) => {
		// Retrieve all of the Productions from the database and res.json them back to the user
		let sqlQuery = "SELECT production_names.ID AS 'Production_ID', " +
			"production_names.Production AS 'Title', " +
			"theatre_names.Theatre AS 'Theatre', " +
			"production_names.Open_Date " +
			"FROM production_names, " +
			"theatre_names " +
			"WHERE (production_names.ID = ";
			let searchTerm = SqlString.escape(req.query.searchID);
			searchTerm = searchTerm.substring(1, searchTerm.length - 1);
			sqlQuery += searchTerm;
			sqlQuery += ") AND (production_names.theatre_id = theatre_names.id) " +
			"ORDER BY production_names.Open_Date";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Production Details
	app.get("/api/ProductionDetails", ( req, res ) => {
		// Retrieve all of the Production Results from the database and res.json them back to the user
		let sqlQuery = "SELECT production_names.ID as 'Production_ID', " +
			"production_names.Production AS 'Title', " +
			"productions.Open_Date, productions.Close_Date, " +
			"productions.Num_Performances, " +
			"theatre_names.Theatre as 'Theatre', " +
			"theatre_names.ID as 'Theatre_ID'," +
			"people_names.Name as 'Name', " +
			"people_names.ID as 'Person_ID', " +
			"position_names.Position as 'Position', " +
			"productions.Role FROM productions, " +
			"production_names, theatre_names, " +
			"people_names, position_names " +
			"WHERE (productions.Production_ID = ";
		let searchTerm = SqlString.escape(req.query.productionID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += ") AND (productions.production_ID = production_names.id) " +
			"AND (productions.theatre_id = theatre_names.id) " +
			"AND (productions.person_id = people_names.id) " +
			"AND (productions.position_id = position_names.id) " +
			"ORDER BY people_names.Last_Name";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Persons
	app.get("/api/Person", ( req, res ) => {
		// Retrieve all of the Persons from the database and res.json them back to the user
		let sqlQuery = "SELECT people_names.id AS 'Person_ID', " +
			"people_names.name AS 'Name' " +
			"FROM people_names " +
			"WHERE people_names.name LIKE '%";
		let searchTerm = SqlString.escape(req.query.searchName);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += "%' ORDER BY people_names.last_name, people_names.name";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting the entry for the specific Person given the ID
	app.get("/api/PersonID", ( req, res ) => {
		// Retrieve the Person matching the ID from the database and res.json them back to the user
		let sqlQuery = "SELECT people_names.id AS 'Person_ID', " +
			"people_names.name AS 'Name' " +
			"FROM people_names " +
			"WHERE people_names.ID = ";
		let searchTerm = SqlString.escape(req.query.searchID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += " ORDER BY people_names.last_name, people_names.name";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Person Details
	app.get("/api/PersonDetails", ( req, res ) => {
		// Retrieve all of the Production Results from the database and res.json them back to the user
		let sqlQuery = "SELECT position_names.Position AS 'Position', " +
			"productions.role, " +
			"production_names.Production AS 'Title', " +
			"productions.Production_ID AS 'Production_ID', " +
			"theatre_names.Theatre AS 'Theatre', " +
			"theatre_names.ID AS 'Theatre_ID', " +
			"productions.open_date " +
			"FROM productions, " +
			"production_names, theatre_names, " +
			"people_names, position_names " +
			"WHERE (productions.Person_ID = ";
		let searchTerm = SqlString.escape(req.query.personID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += ") AND (productions.production_ID = production_names.id) " +
			"AND (productions.theatre_id = theatre_names.id) " +
			"AND (productions.person_id = people_names.id) " +
			"AND (productions.position_id = position_names.id) " +
			"ORDER BY productions.open_date DESC, Position";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Theatres
	app.get("/api/Theatre", ( req, res ) => {
		// Retrieve all of the Theatres from the database and res.json them back to the user
		let sqlQuery =  "SELECT theatre_names.id as 'Theatre_ID', " +
			"theatre_names.theatre as 'Theatre' " +
			"FROM theatre_names " +
			"WHERE theatre_names.theatre LIKE '%";
		let searchTerm = SqlString.escape(req.query.theatreName);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += "%' ORDER BY theatre_names.theatre";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting the entry for the specific Theatre given the ID
	app.get("/api/TheatreID", ( req, res ) => {
		// Retrieve all of the Theatres from the database and res.json them back to the user
		let sqlQuery =  "SELECT theatre_names.id as 'Theatre_ID', " +
			"theatre_names.theatre as 'Theatre' " +
			"FROM theatre_names " +
			"WHERE theatre_names.ID = ";
		let searchTerm = SqlString.escape(req.query.searchID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += " ORDER BY theatre_names.theatre";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Theatre Details
	app.get("/api/TheatreDetails", ( req, res ) => {
		// Retrieve all of the Production Results from the database and res.json them back to the user
		let sqlQuery = "SELECT production_names.Production as 'Title', " +
			"production_names.ID AS 'Production_ID', " +
			"production_names.open_date, " +
			"production_names.close_date " +
			"FROM production_names " +
			"WHERE (production_names.Theatre_ID = ";
		let searchTerm = SqlString.escape(req.query.theatreID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;
		sqlQuery += ") ORDER BY production_names.open_date DESC";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all of the Productions for a specific Year
	app.get("/api/Year", ( req, res ) => {
		// Retrieve all of the Productions from the database and res.json them back to the user
		let sqlQuery = "SELECT production_names.ID AS 'Production_ID', " +
			"production_names.Production AS 'Title', " +
			"theatre_names.Theatre AS 'Theatre', " +
			"production_names.Open_Date " +
			"FROM production_names, " +
			"theatre_names " +
			"WHERE (production_names.Open_Date LIKE '";
		let searchTerm = SqlString.escape(req.query.year);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += "%') AND (production_names.theatre_id = theatre_names.id) " +
			"ORDER BY production_names.Open_Date";
		db.sequelize.query(sqlQuery)
			.spread(function(data, metadata) {
				res.json(data);
			});
	});

	// GET route for getting all Awards for a particular Production
	app.get("/api/ProductionAwards", ( req, res ) => {
		console.log("About to get awards for a production.  req.query is");
		console.log(req.query);
		let sqlQuery = "SELECT production_names.ID AS 'Production_ID', " +
			"production_names.Production AS 'Title', " +
			"theatre_names.ID AS 'Theatre_ID', " +
			"theatre_names.Theatre AS 'Theatre', " +
			"award_names.ID AS 'Award_ID', " +
			"award_names.awards AS 'Award', " +
			"award_types.ID AS 'Category_ID', " +
			"award_types.category AS 'Category', " +
			"people_names.ID AS 'Person_ID', " +
			"people_names.Name AS 'Name', " +
			"awards.won AS 'Won' " +
			"FROM production_names, " +
			"theatre_names, " +
			"award_names, " +
			"award_types, " +
			"people_names, " +
			"awards " +
			"WHERE (awards.Production_ID = ";
		let searchTerm = SqlString.escape(req.query.productionID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += ") AND (awards.production_ID = production_names.id) " +
			"AND (awards.theatre_ID = theatre_names.id) " +
			"AND (awards.award_ID = award_names.id) " +
			"AND (awards.category_ID = award_types.id) " +
			"AND (awards.person_ID = people_names.id) " +
			"ORDER BY Award_ID, Category_ID, Won";
		db.sequelize.query(sqlQuery)
			.spread(function(data, netadata) {
				res.json(data);
			});	
	});

	// GET route for getting all Awrads for a particular Person
	app.get("/api/PersonAwards", ( req, res) => {
		console.log("About to get awards for a person.  req.query is");
		console.log(req.query);
		let sqlQuery = "SELECT production_names.ID AS 'Production_ID', " +
			"production_names.Production AS 'Title', " +
			"theatre_names.ID AS 'Theatre_ID', " +
			"theatre_names.Theatre AS 'Theatre', " +
			"awards.Award_Date, " +
			"award_names.ID AS 'Award_ID', " +
			"award_names.awards AS 'Award', " +
			"award_types.ID AS 'Category_ID', " +
			"award_types.category AS 'Category', " +
			"people_names.ID AS 'Person_ID', " +
			"people_names.Name AS 'Name', " +
			"awards.won AS 'Won' " +
			"FROM production_names, " +
			"theatre_names, " +
			"award_names, " +
			"award_types, " +
			"people_names, " +
			"awards " +
			"WHERE (awards.Person_ID = ";
		let searchTerm = SqlString.escape(req.query.personID);
		searchTerm = searchTerm.substring(1, searchTerm.length - 1);
		sqlQuery += searchTerm;	
		sqlQuery += ") AND (awards.production_ID = production_names.id) " +
			"AND (awards.theatre_ID = theatre_names.id) " +
			"AND (awards.award_ID = award_names.id) " +
			"AND (awards.category_ID = award_types.id) " +
			"AND (awards.person_ID = people_names.id) " +
			"ORDER BY Award_ID, Category_ID, Won";
		db.sequelize.query(sqlQuery)
			.spread(function(data, netadata) {
				res.json(data);
			});	

	});
};
