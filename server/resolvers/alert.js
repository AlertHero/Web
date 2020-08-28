const { requiresAuth, requiresGroupAccess } = require('../utils/permissions');
const pubsub = require('../utils/subscriptions');

const NEW_GROUP_ALERT = 'NEW_GROUP_ALERT';
const NEW_GLOBAL_CODE = 'NEW_GLOBAL_CODE';

module.exports = {
  Alert: {
    createdAt: async ({ id }, __, { dataSources }) => {
      return await dataSources.alertAPI.getTimestamp(id);
    },
    user: async ({ userId }, __, { dataSources }) => {
      return await dataSources.userAPI.findUser({ id: userId });
    },
    code: async ({ codeId }, __, { dataSources }) => {
      return await dataSources.alertAPI.getCode(codeId);
    },
    group: async ({ groupId }, __, { dataSources }) => {
      return await dataSources.groupAPI.findGroup({ id: groupId });
    },
    comments: async ({ id }, __, { dataSources }) => {
      return await dataSources.alertAPI.getComments(id);
    },
  },
  Query: {
    getAlert: requiresAuth.createResolver(async (_, { id }, { dataSources }) =>
      dataSources.alertAPI.findAlert({ id })
    ),
    getAlerts: requiresAuth.createResolver(async (_, { pageSize = 20, after, groupId }, { dataSources }) =>
      dataSources.alertAPI.getAlerts({ pageSize, after, groupId })
    ),
  },
  Mutation: {
    sendAlert: requiresAuth.createResolver(async (_, alert, { dataSources }) =>
      dataSources.alertAPI.sendAlert({ alert, pubsub, NEW_GROUP_ALERT, NEW_GLOBAL_CODE })
    ),
  },
  Subscription: {
    newGroupAlert: {
      subscribe: () => pubsub.asyncIterator(NEW_GROUP_ALERT),
    }
  },
};
