const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("users", "is_disabled", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.createTable("sessions", {
      // use an opaque token (using UUIDV4) as the primary key
      // this will be sent to the client to store and validate the session
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("users", "is_disabled");
    await queryInterface.dropTable("sessions");
  },
};
