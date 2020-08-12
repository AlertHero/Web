const { formatErrors } = require('../../utils');
const { requiresAdmin } = require('../../utils/permission');
const { tryLogin, sendAuthyToken, verifyAuthyToken } = require('../../utils/auth');

module.exports = {
  User: {
    group: ({ id }, args, { models }) =>
      models.Member.findOne({ where: { userId: id } }).then((member) => {
        return models.Group.findOne({ where: { id: member.groupId } });
      }),
  },
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll({ order: [['createdAt', 'ASC']] }, { raw: true }),
    getStats: (parent, args, { models }) => {
      const total = models.User.count();
      const active = models.User.count({ where: { workingNow: true } });
      return { total, active };
    },
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) => tryLogin(email, password, models, SECRET, SECRET2),
    register: (parent, { phone }, { models }) => sendAuthyToken(phone, models),
    verify2FA: (parent, { otp, id }, { models, SECRET, SECRET2 }) => verifyAuthyToken(otp, id, models, SECRET, SECRET2),
    deleteUser: requiresAdmin.createResolver(async (parent, { id }, { models }) => {
      return models.User.destroy({ where: { id } }).then(() => {
        return {
          ok: true,
          res: `User ${id} has been deleted.`,
        };
      }).catch((err) => {
        return {
          ok: false,
          res: 'Deletion failed...',
          errors: formatErrors(err, models),
        };
      });
    }),
    create: requiresAdmin.createResolver(async (parent, args, { models }) => {
      return models.User.create(args).then((user) => {
        return {
          ok: true,
          user,
        };
      }).catch((err) => {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      });
    }),
    bulkCreate: requiresAdmin.createResolver(async (parent, args, { models }) => {
      const { groups } = args;

      return models.User.bulkCreate(args).then((res) => {
        res.map((user) => {
          groups.map((groupId) => {
            models.Member.create({
              userId: (user.dataValues.id),
              role: user.dataValues.role,
              groupId,
            });
          });
        });
        return {
          ok: true,
          res: 'Users have been created.',
        };
      }).catch((err) => {
        return {
          ok: false,
          res: 'Users creation failed...',
          errors: formatErrors(err, models),
        };
      });
    }),
    update: requiresAdmin.createResolver(async (parent, args, { models }) => {
      return models.User.update(args).then(() => {
        return {
          ok: true,
          res: `User ${args.id} has been updated.`,
        };
      }).catch((err) => {
        return {
          ok: false,
          res: 'Updatd failed...',
          errors: formatErrors(err, models),
        };
      });
    }),
  },
};
