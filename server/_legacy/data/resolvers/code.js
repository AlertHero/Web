const { withFilter } = require('graphql-subscriptions');

const pubsub = require('../subscriptions');
const { formatErrors } = require('../../utils');
const { requiresAuth, requiresAdmin } = require('../../utils/permission');

const NEW_GLOBAL_CODE = 'NEW_GLOBAL_CODE';

module.exports = {
  Query: {
    allCodes: requiresAuth.createResolver((parent, args, { models }) => models.Code.findAll({ order: [['id', 'DESC']] })),
    activeCode: (parent, args, { models }) => models.Code.findOne({ where: { active: true } }),
  },
  Mutation: {
    createCode: requiresAdmin.createResolver(async (parent, args, { models }) => {
      try {
        await models.Code.create(args);
        return {
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
  },
  Subscription: {
    newGlobalCode: {
      subscribe: requiresAuth.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_GLOBAL_CODE),
        payload => true,
      )),
    },
  },
};
