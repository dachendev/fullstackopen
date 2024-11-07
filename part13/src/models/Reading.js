const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class Reading extends Model {}

Reading.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "reading",
  }
);

module.exports = Reading;
