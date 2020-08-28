const { DataSource } = require('apollo-datasource');
const { paginateResults } = require('../utils');

class CommentAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getCommentNumber({ id }) {
    return await this.store.Comment.count({
      where: { alertId: id }
    });
  }

  async getComments({ pageSize, after, alertId }) {
    const allComments = await this.store.Comment.findAll({
      where: { alertId },
      order: [['id', 'DESC']],
    });

    const comments = paginateResults({
      after, 
      pageSize,
      results: allComments,
    });
    const lastComment = comments.slice(-1)[0];

    return {
      comments,
      cursor: () => Buffer.from(lastComment.id.toString()).toString('base64'),
      hasMore: comments.length
        ? comments[comments.length - 1].id !== allComments[allComments.length - 1].id
        : false,
    };
  }

  async addComment({ id, text, pubsub, NEW_COMMENT }) {
    const comment = await this.store.Comment.create({
      alertId: id, 
      text,
    });
    pubsub.publish(NEW_COMMENT, {
      newComment: {
        ...comment.dataValues,
        user: this.context.user,
      },
    });
  }
}

module.exports = CommentAPI;
