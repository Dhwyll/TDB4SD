module.exports = function(sequelize, DataTypes) {
	const Production = sequelize.define("Production", {
		'Production_ID': {
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
		},
		'Num_Performances': {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null,
			validate: {notEmpty: true}
		},
		'Theatre_ID': {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Person_ID': {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Position_ID': {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Role': {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			validate: {notEmpty: true}
		}
	});
	Production.removeAttribute('id');
	return Production;
};