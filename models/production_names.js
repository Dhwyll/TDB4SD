module.exports = function(sequelize, DataTypes) {
	const Production_Name = sequelize.define("Production_Names", {
		'ID': {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'production': {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Theatre_ID': {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Open_Date': {
			type: DataTypes.DATEONLY,
			allowNull: true,
			defaultValue: null,
			validate: {notEmpty: true}
		},
		'Close_Date': {
			type: DataTypes.DATEONLY,
			allowNull: true,
			defaultValue: null,
			validate: {notEmpty: true}
		}
	});
	return Production_Name;
};