$(document).ready(function(){

	// Our initial Productions Results array
	const $productionsResultsTable = $(".productionsResultsTable");
	const $personResultsTable = $(".personResultsTable");
	const $theatreResultsTable = $(".theatreResultsTable");
	const $detailsTable = $(".detailsTable");





	// Make sure the various Results containers are hidden at the start.
	$("#productionResultsContainer").hide();
	$("#personResultsContainer").hide();
	$("#theatreResultsContainer").hide();
	$("#detailsContainer").hide();




	// This function grabs Productions from the database and updates the Production Results container
	function getProductionResults(newSearch) {
		$("#productionResultsContainer").hide();
		let searchTerm = {
			title: newSearch
		};
		$.get("/api/Production", searchTerm, function(data) {
			initializeProductionRows(data);
		});
	}

	// This function resets the Production Results displayed with new results from the database
	function initializeProductionRows(productions) {
		if (productions.length > 0) {
			$("#productionResultsContainer").show();
			$productionsResultsTable.empty();
			var rowsToAdd = [];
			for (var i = 0; i < productions.length; i++) {
				rowsToAdd.push(createNewProductionRow(productions[i]));
			}
			$productionsResultsTable.prepend(rowsToAdd);
		} else {
			$("#productionResultsContainer").show();
			$productionsResultsTable.empty();
			var noResults = $(
				[
					"<div class='col-md-12'>No Production matching &quot;",
					$("#searchInput").val().trim(),
					"&quot; was found.</div>"
				].join("")
			);
			$productionsResultsTable.prepend(noResults);
		}
	}

	// This function constructs a results row
	function createNewProductionRow(results) {
		var $newInputRow = $(
			[
				"<div class='row align-items-center margin-below'>",
					"<div class='col-md-9'>",
						"<li class='list-group-item results-item'>",
							"<span class='boldItalic'>",
							results.Title,
							"</span>",
							"<br>", results.Theatre, "<br>", results.Open_Date,
						"</li>",
					"</div>",
					"<div class='col-md-3'>",
						"<button type='button' class='productionDetails btn btn-outline-dark' value='",results.Production_ID,"'>Details</button>",
					"</div>",
				"</div>"
			].join("")
		);
		return $newInputRow;
	}

	// When the Production Details button is clicked, grab the Production ID and call the getProductionDetails function
	$(document).on("click", "button.productionDetails", getProductionDetails);

	// This function grabs the Production Details from the database and updates the Production Details container
	function getProductionDetails(event) {
		event.stopPropagation();
		let showID = $(this).val();
		let whichProduction = {
			productionID: showID
		};
		$.get("/api/ProductionDetails", whichProduction, function(data) {
			initializeProductionDetailRows(data, showID);
		})
	}

	// Reset the Search to look for Title under Productions, run the search, and get the Details for that Production
	function getProductionIDResults(productionID, productionName) {
		$("#searchType").text("Production");
		$("#searchInput").val(productionName);
		$("#productionResultsContainer").hide();
		let productions = [];
		let searchID = {
			searchID: productionID
		};
		$.get("/api/ProductionID", searchID, function(data) {
			productions = data;
			initializeProductionRows(productions);
		});
		let whichProduction = {
			productionID: productionID
		};
		$.get("/api/ProductionDetails", whichProduction, function(data) {
			initializeProductionDetailRows(data, productionID);
		});
	}

	// This function resets the Production Results displayed with new results from the database
	function initializeProductionDetailRows(productionDetails, showID) {
		$("#detailsContainer").show();
		$detailsTable.empty();
		let rowsToAdd = [];
		
		// Set the Title row and push to rowsToAdd
		let $titleRow = $(
			[
				"<div class='row align-items-center'>",
					"<div class='col-md-12 margin-below'>",
						"<span class='boldItalic'>",
							productionDetails[0].Title,
						"</span>",
					"</div>",
				"</div>"
			].join("")
		);
		rowsToAdd.push($titleRow);

		// Set the Author information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Author') {
				let $authorName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								":</span>",
								"<span class='float-right'><span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($authorName);
			};
		};

		// Set the Composer information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Composer') {
				let $composerName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($composerName);
			};
		};

		// Set the Lyricist information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Lyricist') {
				let $lyricistName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($lyricistName);
			};
		};

		// Set the Book information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Book') {
				let $bookName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($bookName);
			};
		};

		// Set the Theatre row and push to rowsToAdd
		let $theatreRow = $(
			[
				"<div class='row align-items-center'>",
					"<div class='col-md-12'><span class='float-left'>Theatre: </span><span class='float-right'>",
						"<span class='theatreLookup likeLink' data-id='",
						productionDetails[0].Theatre_ID,
						"'><span class='boldItalic'>",productionDetails[0].Theatre,"</span></span></span>",
					"</div>",
				"</div>"
			].join("")
		);
		rowsToAdd.push($theatreRow);

		// Set the Opening Date and push to rowsToAdd
		let $openDate = $(
			[
				"<div class='row'>",
					"<div class='col-md-12'>Opening Date: ",
						productionDetails[0].Open_Date,
					"</div>",
				"</div>"
			].join("")
		);
		rowsToAdd.push($openDate);

		// Set the Closing Date and push to rowsToAdd
		let $closeDate = $(
			[
				"<div class='row'>",
					"<div class='col-md-12'>Closing Date: ",
						productionDetails[0].Close_Date,
					"</div>",
				"</div>"
			].join("")
		);
		rowsToAdd.push($closeDate);

		// Set the Number of Performances and push to rowsToAdd
		let $numberPerformances = $(
			[
				"<div class='row'>",
					"<div class='col-md-12'>Number of Performances: ",
						productionDetails[0].Num_Performances,
					"</div>",
				"</div>"
			].join("")
		);
		rowsToAdd.push($numberPerformances);

		// Set the Production Personnel and push to rowsToAdd
		let $personnelHeader = $(
			[
				"<div class='row'>",
					"<div class='col-md-12'><br><hr><br>",
					"</div>",
				"</div>",
				"<div class='row'>",
					"<div class='col-md-12'><h2>Production Personnel</h2></div>",
				"</div>"
			].join("")
		);
		rowsToAdd.push($personnelHeader);

		// Set the Producer information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Producer') {
				let $producerName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($producerName);
			};
		};

		// Set the Director information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Director') {
				let $directorName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($directorName);
			};
		};

		// Set the Assistant Director information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Assistant Director') {
				let $asstDirectorName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($asstDirectorName);
			};
		};

		// Set the Musical Director information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Musical Director') {
				let $musicDirectorName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($musicDirectorName);
			};
		};

		// Set the Choreographer information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Choreographer') {
				let $choreographerName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($choreographerName);
			};
		};

		// Set the Assistant Choreographer information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Assistant Choreographer') {
				let $asstChoreographerName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($asstChoreographerName);
			};
		};

		// Set everybody else's information
		let restArray = ['Producer', 'Director', 'Assistant Director', 'Musical Director', 'Choreographer',
			'Assistant Choreographer', 'Actor', 'Musician', 'Author', 'Book', 'Composer', 'Lyricist'];
		for (let i = 0; i < productionDetails.length; i++) {
			if ($.inArray(productionDetails[i].Position, restArray) < 0) {
				let $restName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Position,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($restName);
			};
		};

		// Set the Cast and push to rowsToAdd
		let $castHeader = $(
			[
				"<div class='row'>",
					"<div class='col-md-12'><br><hr><br>",
					"</div>",
				"</div>",
				"<div class='row'>",
					"<div class='col-md-12'><h2>Cast</h2></div>",
				"</div>"
			].join("")
		);
		rowsToAdd.push($castHeader);

		// Set the Actors information
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Actor') {
				let $actorName = $(
					[
						"<div class='row align-items-center'>",
							"<div class='col-md-12'><span class='float-left'>",
								productionDetails[i].Role,
								": </span><span class='float-right'>",
								"<span class='personLookup likeLink' data-id='",
								productionDetails[i].Person_ID,
								"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($actorName);
			}
		}

		// Set the Orchestra and push to rowsToAdd
		let isOrchestra = false;
		for (let i = 0; i < productionDetails.length; i++) {
			if (productionDetails[i].Position == 'Musician') {
				isOrchestra = true;
			}
		}
		if (isOrchestra) {
			let $castHeader = $(
				[
					"<div class='row'>",
						"<div class='col-md-12'><br><hr><br>",
						"</div>",
					"</div>",
					"<div class='row'>",
						"<div class='col-md-12'><h2>Orchestra</h2></div>",
					"</div>"
				].join("")
			);
			rowsToAdd.push($castHeader);

			// Set the Orchestra information
			for (let i = 0; i < productionDetails.length; i++) {
				if (productionDetails[i].Position == 'Musician') {
					let $musicianName = $(
						[
							"<div class='row align-items-center'>",
								"<div class='col-md-12'><span class='float-left'>",
									productionDetails[i].Role,
									": </span><span class='float-right'>",
									"<span class='personLookup likeLink' data-id='",
									productionDetails[i].Person_ID,
									"'><span class='boldItalic'>",productionDetails[i].Name,"</span></span></span>",
								"</div>",
							"</div>"
						].join("")
					);
					rowsToAdd.push($musicianName);
				}
			}
	
		}



		// Get the Awards information for this show
		let whichProduction = {
			productionID: showID
		};
		$.get("/api/ProductionAwards", whichProduction, function(data) {
			initializeAwardDetailRows(data);
		});

		// This function resets the Production Results displayed with new results from the database
		function initializeAwardDetailRows(awards) {
			if (awards.length > 0) {
				// If there are awards, set the Awards header and push to rowsToAdd
				let $awardsHeader = $(
					[
						"<div class='row'>",
							"<div class='col-md-12'><br><hr><br>",
							"</div>",
						"</div>",
						"<div class='row'>",
							"<div class='col-md-12'><h2>Awards</h2></div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($awardsHeader);

				// Create an array that indicates 
				let currentAwardType = awards[0].Award_ID;
				let awardArray = [currentAwardType];
				for (i = 0; i < awards.length; i++) {
					if (awards[i].Award_ID != currentAwardType) {
						awardArray.push(awards[i].Award_ID);
						currentAwardType = awards[i].Award_ID;
					}
				}
				// For each type of award, create a header for it
				for (j = 0; j < awardArray.length; j++) {
					let $awardTypeHeader = $(
						[
							"<div class='row'>",
								"<div class='col-md-12'><span class='boldItalic'>",
									awards[j].Award,
								" Awards</span></div>",
							"</div>"
						].join("")
					);
					rowsToAdd.push($awardTypeHeader);

					// And then create the awards
					for (k = 0; k < awards.length; k++) {
						if (awards[k].Award_ID == awardArray[j]) {			// If the current award is in the right Award Type
							if (awards[k].Won) {							// Then if the award was won
								if (awards[k].Person_ID == null) {			// Then if the winner wasn't a person, create the entry for the theatre
									let $awardRow = $(
										[
											"<div class='row align-items-center'>",
												"<div class='col-md-12'><span class='float-left'>",
													awards[k].Category,
													": </span><span class='float-right'>",
													"<span class='boldItalic'>(won)</span> <span class='theatreLookup likeLink' data-id='",
													awards[k].Theatre_ID,
													"'><span class='boldItalic'>",awards[k].Theatre,"</span></span>",
													"</span>",
												"</div>",
											"</div>"
										].join("")
									);									
									rowsToAdd.push($awardRow);	
								} else {									// Else create the entry for the person
									let $awardRow = $(
										[
											"<div class='row align-items-center'>",
												"<div class='col-md-12'><span class='float-left'>",
													awards[k].Category,
													": </span><span class='float-right'>",
													"<span class='boldItalic'>(won)</span> <span class='personLookup likeLink' data-id='",
													awards[k].Person_ID,
													"'><span class='boldItalic'>",awards[k].Name,"</span></span>",
													"</span>",
												"</div>",
											"</div>"
										].join("")
									);									
									rowsToAdd.push($awardRow);	
								}
							} else {									// Else the award is only a nomination
								if (awards[k].Person_ID == null) {		// If the nominee isn't a person, create the entry for the theatre
									let $awardRow = $(
										[
											"<div class='row align-items-center'>",
												"<div class='col-md-12'><span class='float-left'>",
													awards[k].Category,
													": </span><span class='float-right'>",
													"(nominated) <span class='theatreLookup likeLink' data-id='",
													awards[k].Theatre_ID,
													"'><span class='boldItalic'>",awards[k].Theatre,"</span></span>",
													"</span>",
												"</div>",
											"</div>"
										].join("")
									);									
									rowsToAdd.push($awardRow);	
								} else {								// Else create the entry for the person
									let $awardRow = $(
										[
											"<div class='row align-items-center'>",
												"<div class='col-md-12'><span class='float-left'>",
													awards[k].Category,
													": </span><span class='float-right'>",
													"(nominated) <span class='personLookup likeLink' data-id='",
													awards[k].Person_ID,
													"'><span class='boldItalic'>",awards[k].Name,"</span></span>",
													"</span>",
												"</div>",
											"</div>"
										].join("")
									);									
									rowsToAdd.push($awardRow);	
								}
							}
						}
					}
				}
			}
			$detailsTable.prepend(rowsToAdd);
		}

	}




	// This function grabs People from the database and updates the Person Results container
	function getPersonResults(newSearch) {
		$("#personResultsContainer").hide();
		let persons = [];
		let searchTerm = {
			searchName: newSearch
		};
		$.get("/api/Person", searchTerm, function(data) {
			persons = data;
			initializePersonRows(persons);
		});
	}

	// Reset the Search to look for Name under Persons, run the search, and get the Details for that Person
	function getPersonIDResults(personID, personName) {
		$("#searchType").text("Person");
		$("#searchInput").val(personName);
		$("#personResultsContainer").hide();
		let persons = [];
		let searchID = {
			searchID: personID
		};
		$.get("/api/PersonID", searchID, function(data) {
			persons = data;
			initializePersonRows(persons);
		});
		let whichPerson = {
			personID: personID
		};
		$.get("/api/PersonDetails", whichPerson, function(data) {
			initializePersonDetailRows(data, personID);
		});
	}

	// This function resets the Production Results displayed with new results from the database
	function initializePersonRows(persons) {
		if ($("#searchType").text().trim() != "Person") {
			$("#personHR").show();
		} else {
			$("#personHR").hide();
		}
		if (persons.length > 0) {
			$("#personResultsContainer").show();
			$personResultsTable.empty();
			var rowsToAdd = [];
			for (var i = 0; i < persons.length; i++) {
				rowsToAdd.push(createNewPersonRow(persons[i]));
			}
			$personResultsTable.prepend(rowsToAdd);
		} else {
			$("#personResultsContainer").show();
			$personResultsTable.empty();
			var noResults = $(
				[
					"<div class='col-md-12'>No Person matching &quot;",
					$("#searchInput").val().trim(),
					"&quot; was found.</div>"
				].join("")
			);
			$personResultsTable.prepend(noResults);
		}
	}

	// This function constructs a results row
	function createNewPersonRow(results) {
		var $newInputRow = $(
			[
				"<div class='row align-items-center margin-below'>",
					"<div class='col-md-9'>",
						"<li class='list-group-item results-item'>",
							results.Name,
						"</li>",
					"</div>",
					"<div class='col-md-3'>",
						"<button type='button' class='personDetails btn btn-outline-dark' value='", results.Person_ID, "'>Details</button>",
					"</div>",
				"</div>"
			].join("")
		);
		return $newInputRow;
	}

	// When the Person Details button is clicked, grab the Person ID and call the getPersonDetails function
	$(document).on("click", "button.personDetails", getPersonDetails);

	// This function grabs the Person Details from the database and updates the Person Details container
	function getPersonDetails(event) {
		event.stopPropagation();
		let personID = $(this).val();
		let whichPerson = {
			personID: personID
		};
		$.get("/api/PersonDetails", whichPerson, function(data) {
			initializePersonDetailRows(data, personID);
		});
	}

	// This function resets the Person Results displayed with new results from the database
	function initializePersonDetailRows(personDetails, personID) {
		$("#detailsContainer").show();
		$detailsTable.empty();
		let rowsToAdd = [];
		
		// For each Position, create an entry and push it to rowsToAdd
		for (let i = 0; i < personDetails.length; i++) {
			if (personDetails[i].Position == 'Actor') {
				let $position = $(
					[
						"<div class='row align-items-center margin-below'>",
							"<div class='col-md-12'>",
								"<li class='list-group-item results-item'>",
									personDetails[i].Position,
									" playing &quot;",
									personDetails[i].Role,
									"&quot; in ",
									"<span class='productionLookup likeLink' data-id='",
									personDetails[i].Production_ID,
									"'><span class='boldItalic'>",personDetails[i].Title,"</span></span>",
									" at ",
									"<span class='theatreLookup likeLink' data-id='",
									personDetails[i].Theatre_ID,
									"'><span class='boldItalic'>",personDetails[i].Theatre,"</span></span>",
									" in ",
									personDetails[i].Open_Date.slice(0,4),
								"</li>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($position);
			} else {
				let $position = $(
					[
						"<div class='row align-items-center margin-below'>",
							"<div class='col-md-12'>",
								"<li class='list-group-item results-item'>",
									personDetails[i].Position,
									" for ",
									"<span class='productionLookup likeLink' data-id='",
									personDetails[i].Production_ID,
									"'><span class='boldItalic'>",personDetails[i].Title,"</span></span>",
									" at ",
									"<span class='theatreLookup likeLink' data-id='",
									personDetails[i].Theatre_ID,
									"'><span class='boldItalic'>",personDetails[i].Theatre,"</span></span>",
									" in ",
									personDetails[i].Open_Date.slice(0,4),
								"</li>",
							"</div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($position);
			}
		}

		// Get the Awards information for this person
		let whichPerson = {
			personID: personID
		};
		$.get("/api/PersonAwards", whichPerson, function(data) {
			initializeAwardDetailRows(data);
		});

		// This function resets the Awards Results displayed with new results from the database
		function initializeAwardDetailRows(awards) {
			if (awards.length > 0) {
				// If there are awards, set the Awards header and push to rowsToAdd
				let $awardsHeader = $(
					[
						"<div class='row'>",
							"<div class='col-md-12'><br><hr><br>",
							"</div>",
						"</div>",
						"<div class='row'>",
							"<div class='col-md-12'><h2>Awards</h2></div>",
						"</div>"
					].join("")
				);
				rowsToAdd.push($awardsHeader);

				// Create an array that indicates which awards
				let currentAwardType = awards[0].Award_ID;
				let currentAwardSet = {
					Award_ID: currentAwardType,
					Award: awards[0].Award
				}
				let awardArray = [currentAwardSet];
				for (i = 0; i < awards.length; i++) {
					if (awards[i].Award_ID != currentAwardType) {
						currentAwardSet = {
							Award_ID: awards[i].Award_ID,
							Award: awards[i].Award
						}
						awardArray.push(currentAwardSet);
						currentAwardType = awards[i].Award_ID;
					}
				}

				// For each type of award, create a header for it
				for (j = 0; j < awardArray.length; j++) {
					let $awardTypeHeader = $(
						[
							"<div class='row'>",
								"<div class='col-md-12'><span class='boldItalic'>",
									awardArray[j].Award,
								" Awards</span></div>",
							"</div>"
						].join("")
					);
					rowsToAdd.push($awardTypeHeader);

					// And then create the awards
					for (k = 0; k < awards.length; k++) {
						if (awards[k].Award_ID == awardArray[j].Award_ID) {
							if (awards[k].Won) {
								let $awardRow = $(
									[
										"<div class='row align-items-center margin-below'>",
											"<div class='col-md-12'>",
												"<li class='list-group-item results-item'>",
													awards[k].Award_Date.slice(0, 4),
													" ",
													awards[k].Category,
													" <span class='boldItalic'>(won)</span> ",
													"<span class='productionLookup likeLink' data-id='",
													awards[k].Production_ID,
													"'><span class='boldItalic'>",
													awards[k].Title,
													"</span></span>",
												"</li>",
											"</div>",
										"</div>"
									].join("")
								);									
								rowsToAdd.push($awardRow);
							} else {
								let $awardRow = $(
									[
										"<div class='row align-items-center margin-below'>",
											"<div class='col-md-12'>",
												"<li class='list-group-item results-item'>",
													awards[k].Award_Date.slice(0, 4),
													" ",
													awards[k].Category,
													" (nominated) ",
													"<span class='productionLookup likeLink' data-id='",
													awards[k].Production_ID,
													"'><span class='boldItalic'>",
													awards[k].Title,
													"</span></span>",
												"</li>",
											"</div>",
										"</div>"
									].join("")
								);									
								rowsToAdd.push($awardRow);

							}
						}
					}
				}
			}
			$detailsTable.prepend(rowsToAdd);
		}
	}



	

	// This function grabs Theatres from the database and updates the Theatre Results container
	function getTheatreResults(newSearch) {
		$("#theatreResultsContainer").hide();
		let theatres = [];
		let searchTerm = {
			theatreName: newSearch
		};
		$.get("/api/Theatre", searchTerm, function(data) {
			theatres = data;
			initializeTheatreRows(theatres);
		});
	}

	// Reset the Search to look for Title under Productions, run the search, and get the Details for that Production
	function getTheatreIDResults(theatreID, theatreName) {
		$("#searchType").text("Theatre");
		$("#searchInput").val(theatreName);
		$("#theatreResultsContainer").hide();
		let theatre = [];
		let searchID = {
			searchID: theatreID
		};
		$.get("/api/TheatreID", searchID, function(data) {
			theatre = data;
			initializeTheatreRows(theatre);
		});
		let whichTheatre = {
			theatreID: theatreID
		};
		$.get("/api/TheatreDetails", whichTheatre, function(data) {
			initializeTheatreDetailRows(data, theatreID);
		});
	}

	// This function resets the Production Results displayed with new results from the database
	function initializeTheatreRows(theatres) {
		if ($("#searchType").text().trim() != "Theatre") {
			$("#theatreHR").show();
		} else {
			$("#theatreHR").hide();
		}
		if (theatres.length > 0) {
			$("#theatreResultsContainer").show();
			$theatreResultsTable.empty();
			var rowsToAdd = [];
			for (var i = 0; i < theatres.length; i++) {
				rowsToAdd.push(createNewTheatreRow(theatres[i]));
			}
			$theatreResultsTable.prepend(rowsToAdd);
		} else {
			$("#theatreResultsContainer").show();
			$theatreResultsTable.empty();
			var noResults = $(
				[
					"<div class='col-md-12'>No Theatre matching &quot;",
					$("#searchInput").val().trim(),
					"&quot; was found.</div>"
				].join("")
			);
			$theatreResultsTable.prepend(noResults);
		}
	}

	// This function constructs a results row for the Theatres
	function createNewTheatreRow(results) {
		var $newInputRow = $(
			[
				"<div class='row align-items-center'>",
					"<div class='col-md-9'>",
						"<li class='list-group-item results-item'>",
							results.Theatre,
						"</li>",
					"</div>",
					"<div class='col-md-3'>",
						"<button type='button' class='theatreDetails btn btn-outline-dark' value='", results.Theatre_ID, "'>Details</button>",
					"</div>",
				"</div>"
			].join("")
		);
		return $newInputRow;
	}

	// When the Theatre Details button is clicked, grab the Person ID and call the getTheatreDetails function
	$(document).on("click", "button.theatreDetails", getTheatreDetails);

	// This function grabs the Theatre Details from the database and updates the  Details container
	function getTheatreDetails(event) {
		event.stopPropagation();
		let whichTheatre= {
			theatreID: $(this).val()
		};
		$.get("/api/TheatreDetails", whichTheatre, function(data) {
			initializeTheatreDetailRows(data);
		})
	}

	// This function resets the Theatre Deatils Results displayed with new results from the database
	function initializeTheatreDetailRows(showDetails) {
		$("#detailsContainer").show();
		$detailsTable.empty();
		let rowsToAdd = [];
		
		// For each Show, create an entry and push it to rowsToAdd
		for (let i = 0; i < showDetails.length; i++) {
			let $show = $(
				[
					"<div class='row align-items-center margin-below'>",
						"<div class='col-md-12'>",
							"<li class='list-group-item results-item'>",
								"<span class='productionLookup likeLink' data-id='",
								showDetails[i].Production_ID,
								"'><span class='boldItalic'>",
								showDetails[i].Title,
								"</span></span><br>",
								"Opening Date: ",
								showDetails[i].Open_Date,
								"<br>Closing Date: ",
								showDetails[i].Close_Date,
							"</li>",
						"</div>",
					"</div>"
				].join("")
			);
			rowsToAdd.push($show);
		}

		$detailsTable.prepend(rowsToAdd);
	}





	// This function grabs Productions by Year from the database and updates the Production Results container
	function getYearResults(newSearch) {
		$("#productionResultsContainer").hide();
		let productions = [];
		let searchTerm = {
			year: newSearch
		};
		$.get("/api/Year", searchTerm, function(data) {
			productions = data;
			initializeProductionRows(productions);
		});
	}



	// When a Search Type is chosen, update the dropdown button
	$(function() {
		$(".dropdown-menu a").click(function(){
			$("#searchType").text($(this).text());
		});
	});

	// When clicking on an individual Production in the Details, look up that Production and get their Details
	$(document).on("click", "span.productionLookup", function() {
		$("#productionResultsContainer").hide();
		$("#personResultsContainer").hide();
		$("#theatreResultsContainer").hide();
		$("#detailsContainer").hide();
		getProductionIDResults($(this).attr("data-id"), $(this).text());
	});

	// When clicking on an individual Person in the Details, look up at that Person and get their Details
	$(document).on("click", "span.personLookup", function() {
		$("#productionResultsContainer").hide();
		$("#personResultsContainer").hide();
		$("#theatreResultsContainer").hide();
		$("#detailsContainer").hide();
		getPersonIDResults($(this).attr("data-id"), $(this).text());
	});

	// When clicking on an individual Theatre in the Details, look up that Theatre and get its Details
	$(document).on("click", "span.theatreLookup", function() {
		$("#productionResultsContainer").hide();
		$("#personResultsContainer").hide();
		$("#theatreResultsContainer").hide();
		$("#detailsContainer").hide();
		getTheatreIDResults($(this).attr("data-id"), $(this).text());
	});

	// This functions calls the various searches
	$("#searchButton").on("click", function(event) {
		event.preventDefault();
		$("#productionResultsContainer").hide();
		$("#personResultsContainer").hide();
		$("#theatreResultsContainer").hide();
		$("#detailsContainer").hide();
		var newSearch = $("#searchInput").val().trim();
		var newSearchType = $("#searchType").text().trim();
		if (newSearch.length > 0) {
			switch(newSearchType) {
				case 'All':
					getProductionResults(newSearch);
					getPersonResults(newSearch);
					getTheatreResults(newSearch);
					break;
				case 'Production':
					getProductionResults(newSearch);
					break;
				case 'Person':
					getPersonResults(newSearch);
					break;
				case 'Theatre':
					getTheatreResults(newSearch);
					break;
				case 'Year':
					getYearResults(newSearch);
					break;
				default:
					getProductionResults(newSearch);
					getPersonResults(newSearch);
					getTheatreResults(newSearch);
			}	
		}
	});

});