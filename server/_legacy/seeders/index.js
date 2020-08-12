const codes = require('./codes');
const users = require('./users');
const admins = require('./admins');
const groups = require('./groups');
const channels = require('./channels');

module.exports = async (models) => {
  try {
    return await models.sequelize.transaction(async () => {
      await groups(models);
      await channels(models);
      await codes(models);
      await admins(models);
      await users(models);
    }).then(() => {
      console.log('Database is ready!');
    }).catch((err) => {
      console.log('Database Build Failed', err);
    });
  } catch (err) {
    console.log('Something went wrong...', err);
  }
};
