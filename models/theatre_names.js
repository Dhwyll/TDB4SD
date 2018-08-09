module.exports = function(sequelize, DataTypes) {
	const Theatre_Names = sequelize.define("Theatre_Names", {
		'ID': {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'theatre': {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {notEmpty: true}
		}
	});
	return Theatre_Names;
};