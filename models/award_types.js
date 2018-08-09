module.exports = function(sequelize, DataTypes) {
	const Award_Types = sequelize.define("Award_Types", {
		'ID': {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'category': {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {notEmpty: true}
		}
	});
	return Award_Types;
};