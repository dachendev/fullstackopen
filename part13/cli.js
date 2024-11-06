const { Sequelize, QueryTypes } = require("sequelize");

const db = new Sequelize("postgres://postgres:example@localhost:5432/postgres");

const main = async () => {
  try {
    const blogs = await db.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });

    blogs.forEach((b) =>
      console.log(`${b.author}: '${b.title}', ${b.likes} likes`)
    );
  } catch (error) {
    console.log("Error connecting to database:", error);
  } finally {
    await db.close();
  }
};

main();
