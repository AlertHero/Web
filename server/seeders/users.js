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
      .then(async (user) => {
        const groupId = _.random(2, 4);
        await models.Member.create({
          userId: user.id,
          role: user.role,
          groupId,
        });
        _.times(2, () => {
          models.Alert.create({
            groupId,
            userId: user.id,
            codeId: _.random(1, 4),
            title: casual.sentences(1),
            text: casual.sentences(3),
            upvotes: _.random(0, 5),
            downvotes: _.random(0, 2),
          }).then((msg) => {
            models.Comment.create({
              alertId: msg.id,
              text: casual.sentences(2),
            })
          });
        })
      })
      .catch((err) => {
        console.log('Users Error ', err);
      });
  });
};
