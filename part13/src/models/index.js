const User = require("./User");
const Blog = require("./Blog");
const Reading = require("./Reading");
const Session = require("./Session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Reading, as: "readings" });
Blog.belongsToMany(User, { through: Reading });

Session.belongsTo(User);

module.exports = {
  User,
  Blog,
  Reading,
  Session,
};
