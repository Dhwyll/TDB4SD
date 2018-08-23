module.exports = function(sequelize, DataTypes) {
	const Awards = sequelize.define("Awards", {
		'Production_ID': {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Theatre_ID': {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Award_Date': {
			type: DataTypes.DATEONLY,
			allowNull: true,
			defaultValue: null,
			validate: {notEmpty: true}
		},
		'Award_ID': {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Category_ID': {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Person_ID': {
			type: DataTypes.INTEGER,
			allowNull: true,
			validate: {notEmpty: true}
		},
		'Won': {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			validate: {notEmpty: true}
		}
	});
	Awards.removeAttribute('id');
	return Awards;
};