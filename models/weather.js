'use strict';
module.exports = (sequelize, DataTypes) => {
  const Weather = sequelize.define('Weather', {
    email: DataTypes.STRING,
    cityName: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE
  }, {});
  Weather.associate = function(models) {
  };
  return Weather;
};