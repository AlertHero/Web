const { requiresAuth } = require('../utils/permissions');
const pubsub = require('../utils/subscriptions');

const NEW_COMMENT = 'NEW_COMMENT';

module.exports = {
  Query: {
    getCommentNumber: requiresAuth.createResolver(async (_, { id }, { dataSources }) =>
      dataSources.commentAPI.findCommentNumber({ id })
    ),
    getComments: requiresAuth.createResolver(
      async (_, { pageSize = 20, after, alertId }, { dataSources }) =>
        dataSources.commentAPI.getComments({ pageSize, after, alertId })
    ),
  },
  Mutation: {
    addComment: requiresAuth.createResolver(async (_, { id, text }, { dataSources }) =>
      dataSources.commentAPI.addComment({
        id,
        text,
        pubsub,
        NEW_COMMENT,
      })
    ),
  },
  Subscription: {
    newComment: {
      subscribe: () => pubsub.asyncIterator(NEW_COMMENT),
    },
  },
};
