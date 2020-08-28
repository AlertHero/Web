const { requiresAdmin, requiresAuth } = require('../utils/permissions');

const NEW_GLOBAL_CODE = 'NEW_GLOBAL_CODE';

module.exports = {
  Code: {
    isActive: async ({ id }, __, { dataSources }) => {
      return await dataSources.codeAPI.getStatus({ id });
    },
  },
  Query: {
    getActiveCode: requiresAuth.createResolver(async (_, __, { dataSources }) =>
      dataSources.codeAPI.getActiveCode()
    ),
    getAllCodes: requiresAuth.createResolver(async (_, __, { dataSources }) =>
      dataSources.codeAPI.getAllCodes()
    ),
  },
  Mutation: {
    createCode: requiresAdmin.createResolver(async (_, code, { dataSources }) =>
      dataSources.codeAPI.createCode(code)
    ),
  },
  Subscription: {
    newGroupAlert: {
      subscribe: () => pubsub.asyncIterator(NEW_GLOBAL_CODE),
    },
  },
};
