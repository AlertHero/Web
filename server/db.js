const { Sequelize } = require('sequelize');

const UserModel = require('./models/user');
const MemberModel = require('./models/member');
const GroupModel = require('./models/group');
const AlertModel = require('./models/alert');
const CodeModel = require('./models/code');
const MessageModel = require('./models/message');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { DB, DB_HOST, DB_USER, DB_PASS, DB_TYPE } = process.env;

module.exports.createStore = async () => {
  let maxReconnects = 10;
  let connected = false;

  // Database setup from .env
  const sequelize = new Sequelize(DB, DB_USER, DB_PASS, {
    protocol: DB_TYPE,
    dialect: DB_TYPE,
    host: DB_HOST,
    logging: false,
    ssl: true,
    define: {
      timestamps: true,
    },
  });

  // Test connection. Reconnect after 3 seconds if connection fails.
  while (!connected && maxReconnects) {
    try {
      sequelize.authenticate();
      connected = true;
    } catch (err) {
      console.log('reconnecting in 3 seconds');
      sleep(3000);
      maxReconnects -= 1;
    }
  }
  if (!connected) {
    return null;
  }

  // Define each model from external files
  const User = UserModel(sequelize, Sequelize);
  const Member = MemberModel(sequelize, Sequelize);
  const Group = GroupModel(sequelize, Sequelize);
  const Alert = AlertModel(sequelize, Sequelize);
  const Code = CodeModel(sequelize, Sequelize);
  const Message = MessageModel(sequelize, Sequelize);

  const Models = { User, Member, Group, Alert, Code, Message, sequelize };
  return Models;
};
