module.exports = function(sequelize, DataTypes) {
	const People_Names = sequelize.define("People_Names", {
		'ID': {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Name': {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Last_Name': {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {notEmpty: true}
		}

	});
	return People_Names;
};