const User = require("./User");
const Blog = require("./Blog");
const Reading = require("./Reading");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Reading, as: "readings" });
Blog.belongsToMany(User, { through: Reading });

module.exports = {
  User,
  Blog,
  Reading,
};
