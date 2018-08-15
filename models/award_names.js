module.exports = function(sequelize, DataTypes) {
	const Award_Names = sequelize.define("Award_Names", {
		'ID': {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			validate: {notEmpty: true}
		},
		'Awards': {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {notEmpty: true}
		}
	});
	return Award_Names;
};