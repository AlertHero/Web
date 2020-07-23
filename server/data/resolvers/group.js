const { formatErrors } = require('../../utils');
const { requiresAdmin } = require('../../utils/permission');

module.exports = {
  Query: {
    getGroup: (parent, { id }, { models }) => models.Group.findOne({ where: { id } }),
  },

  Mutation: {
    createGroup: requiresAdmin.createResolver(async (parent, args, { models, user }) => {
      try {
        const response = await models.sequelize.transaction(async () => {
          const group = await models.Group.create({ ...args });
          await models.Channel.create({ name: args.name, public: true, groupId: group.id });
          await models.Member.create({ groupId: group.id, userId: user.id, role: 1 });
          return group;
        });
        return {
          ok: true,
          group: response,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
    addGroupMember: requiresAdmin.createResolver(async (parent, { email, groupId }, { models, user }) => {
      try {
        const memberPromise = models.Member.findOne({ where: { groupId, userId: user.id } }, { raw: true });
        const userToAddPromise = models.User.findOne({ where: { email } }, { raw: true });
        const [member, userToAdd] = await Promise.all([memberPromise, userToAddPromise]);
        if (!userToAdd) {
          return {
            ok: false,
            errors: [{ path: 'email', message: 'Could not find user with this email' }],
          };
        }
        await models.Member.create({ userId: userToAdd.id, groupId });
        return {
          ok: true,
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
