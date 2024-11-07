const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully");
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};

module.exports = { connectToDatabase, sequelize };
