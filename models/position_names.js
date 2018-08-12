module.exports = function(sequelize, DataTypes) {
	const Position_Names = sequelize.define("Position_Names", {
		'ID': {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Position': {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {notEmpty: true}
		}
	});
	return Position_Names;
};