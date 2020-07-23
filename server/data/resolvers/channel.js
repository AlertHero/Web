const { formatErrors } = require('../../utils');
const { requiresAuth, requiresAdmin } = require('../../utils/permission');

module.exports = {
  Query: {
    allChannels: requiresAdmin.createResolver(async (parent, args, { models }) => models.Channel.findAll()),
  },
  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const admin = await models.Member.findOne({ where: { role: { $gt: 0 } } }, { raw: true });
        if (admin.userId !== user.id) {
          return {
            ok: false,
            errors: [{
              path: 'name',
              message: 'You have to be an admin to create channels',
            }],
          };
        }
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
  },
};
