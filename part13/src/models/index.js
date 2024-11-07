const User = require("./User");
const Blog = require("./Blog");

User.hasMany(Blog);
Blog.belongsTo(User);
User.sync({ alter: true });
Blog.sync({ alter: true });

module.exports = {
  User,
  Blog,
};
