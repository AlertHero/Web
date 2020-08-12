const GraphQLDate = require('graphql-date');
const { withFilter } = require('graphql-subscriptions');

const { pubsub } = require('../subscriptions');
const { requiresAuth, requiresTeamAccess } = require('../../utils/permission');

const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

module.exports = {
  Date: GraphQLDate,
  Message: {
    code: ({ codeId }, args, { models }) => {
      return models.Code.findOne({ where: { id: codeId } }, { raw: true });
    },
    reaction: ({ id }, args, { models }) => {
      return models.Reaction.findOne({ where: { messageId: id } }, { raw: true });
    },
    comments: ({ id }, args, { models }) => {
      return models.Comment.findAll({ where: { messageId: id } }, { raw: true });
    },
    channel: ({ channelId }, args, { models }) => {
      return models.Channel.findOne({ where: { id: channelId } }, { raw: true });
    },
    user: ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }
      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },
  PageInfo: {
    hasNextPage(connection) {
      return connection.hasNextPage();
    },
    hasPreviousPage(connection) {
      return connection.hasPreviousPage();
    },
  },
  Query: {
    allMessages: requiresAuth.createResolver((parent, args, { models }) =>
      models.Message.findAll({ order: [['createdAt', 'DESC']] }, { raw: true })),
    lastGeneralMessage: requiresAuth.createResolver((parent, args, { models }) =>
      models.Message.findOne({ where: { channelId: '1' }, order: [['createdAt', 'DESC']] }, { raw: true })),
    codesOfMessages: (parent, args, { models }) => {
      const severe = models.Message.count({ where: { codeId: 1 } });
      const elevated = models.Message.count({ where: { codeId: 2 } });
      const low = models.Message.count({ where: { codeId: 3 } });
      const behavior = models.Message.count({ where: { codeId: 4 } });
      return {
        severe,
        elevated,
        behavior,
        low,
      };
    },
    // ADD AUTH HERE
    messagesRelay: (parent, {
      channelId, first, last, before, after,
    }, { models }) => {
      const where = {};
      if (before) { where.id = { $gt: Buffer.from(before, 'base64').toString() }; }
      if (after) { where.id = { $lt: Buffer.from(after, 'base64').toString() }; }
      // Return Specific Channel Messages
      where.channelId = channelId;
      return models.Message.findAll({ where, order: [['id', 'DESC']], limit: first || last }, { raw: true })
        .then((messages) => {
          const edges = messages.map(message => ({
            cursor: Buffer.from(message.id.toString()).toString('base64'), // convert id to cursor
            node: message,
          }));
          return {
            edges,
            pageInfo: {
              hasNextPage() {
                if (messages.length < (last || first)) {
                  return Promise.resolve(false);
                }
                return models.Message.findOne({
                  where: {
                    id: {
                      [before ? '$gt' : '$lt']: messages[messages.length - 1].id,
                    },
                  },
                  order: [['id', 'DESC']],
                }).then(message => !!message);
              },
              hasPreviousPage() {
                return models.Message.findOne({
                  where: {
                    id: where.id,
                  },
                  order: [['id']],
                }).then(message => !!message);
              },
            },
          };
        });
    },
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const channels = args.channelId;
        channels.map(async (ch) => {
          const message = await models.Message.create({
            userId: user.id,
            codeId: args.codeId,
            channelId: ch,
            text: args.text,
          });
          const asyncFunc = async (codeId) => {
            await models.Code.findAll().then((codes) => {
              codes.map((code) => {
                models.Code.update({ isActive: false }, { where: { id: code.id } });
              });
            });
            await models.Code.update({ isActive: true }, { where: { id: codeId } });
            const currentUser = await models.User.findOne({ where: { id: user.id } });
            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId: ch,
              newChannelMessage: {
                ...message.dataValues,
                user: currentUser.dataValues,
              },
            });
          };
          asyncFunc(args.codeId);
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }),
  },
  Subscription: {
    newChannelMessage: {
      subscribe: requiresTeamAccess.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId,
      )),
    },
  },
};
