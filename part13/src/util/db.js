const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("./config");
const { Umzug, SequelizeStorage } = require("umzug");

const sequelize = new Sequelize(DATABASE_URL);

const umzugOptions = {
  migrations: {
    glob: "migrations/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const umzug = new Umzug(umzugOptions);
  const migrations = await umzug.up();
  console.log("Migrations up to date", {
    files: migrations.map((m) => m.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const umzug = new Umzug(umzugOptions);
  await umzug.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("Connected to database successfully");
  } catch (err) {
    console.error("Error connecting to database:", err);
    process.exit(1);
  }
};

module.exports = {
  connectToDatabase,
  sequelize,
  rollbackMigration,
};
