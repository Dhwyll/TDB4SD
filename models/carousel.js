module.exports = function(sequelize, DataTypes) {
	const Carousel = sequelize.define("Carousel", {
		'Production_Title': {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Open_Date': {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Close_Date': {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {notEmpty: true}
		},
		'Info': {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			validate: {notEmpty: true}
		},
		'URL': {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			validate: {notEmpty: true}
		},
		'Image': {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			validate: {notEmpty: true}
		}
	});
	Carousel.removeAttribute('id');
	return Carousel;
};