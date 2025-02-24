'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReadingProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReadingProgress.init({
    borrowingId: DataTypes.UUID,
    currentPage: DataTypes.INTEGER,
    lastReadDate: DataTypes.DATE,
    readingTime: DataTypes.INTEGER,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ReadingProgress',
  });
  return ReadingProgress;
};