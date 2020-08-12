const _ = require('lodash');
const casual = require('casual');

module.exports = async (models) => {
  return _.times(50, () => {
    return models.User.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
      phone: '5555555555',
      title: casual.name_prefix,
      email: casual.email,
      password: 'pass1',
      version: 1,
      role: 0,
      employed: true,
      workingNow: casual.boolean,
    })
      .then((user) => {
        models.Member.create({
          userId: user.id,
          role: user.role,
          groupId: _.random(2, 4),
        });
      })
      .catch((err) => {
        console.log('Users Error ', err);
      });
  });
};
