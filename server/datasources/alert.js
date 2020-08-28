const { DataSource } = require('apollo-datasource');
const { paginateResults } = require('../utils/index');

class AlertAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getTimestamp({ id }) {
    const alert = await this.store.Alert.findOne({ where: { id } });
    return alert.createdAt;
  }

  async getCode({ codeId }) {
    return await this.store.Code.findOne({ where: { id: codeId } });
  }

  async getComments({ id: alertId }) {
    return await this.store.Comment.findAll({
      where: { alertId }, limit: 20,
    });
  }

  async findAlert({ id }) {
    return await this.store.Alert.findOne({ where: { id } });
  }

  async getUserAlerts({ id: userId }) {
    return await this.store.Alert.findAll({ where: { userId } });
  }

  async getAlerts({ pageSize, after, groupId }) {
    const allAlerts = await this.store.Alert.findAll({
      where: { groupId },
      order: [['id', 'DESC']],
    });

    const alerts = paginateResults({
      after, 
      pageSize, 
      results: allAlerts,
    });
    const lastAlert = alerts.slice(-1)[0];

    return {
      alerts,
      cursor: () => Buffer.from(lastAlert.id.toString()).toString('base64'),
      hasMore: alerts.length
        ? alerts[alerts.length - 1].id !==
          allAlerts[allAlerts.length - 1].id
        : false,
    };
  }

  async sendAlert({ alert: alertArg, pubsub, NEW_GROUP_ALERT, NEW_GLOBAL_CODE }) {
    try {
      const alertObj = JSON.parse(JSON.stringify(alertArg));

      if (alertObj.groupIds.length > 1) {
        groups.map(async (id) => {
          const alert = await this.store.Alert.create({
            userId: this.context.user.id,
            groupId: id,
            codeId: alertObj.codeId,
            title: alertObj.title,
            text: alertObj.text,
            image: alertObj.image,
            upvotes: 0,
            downvotes: 0,
          });
          const code = await this.store.Code.findOne({
            where: { id: alertObj.codeId },
          });
          pubsub.publish(NEW_GROUP_ALERT, {
            groupId: alertObj.groupIds[0],
            newGroupAlert: {
              ...alert.dataValues,
              user: this.context.user,
            },
          });
          pubsub.publish(NEW_GLOBAL_CODE, {
            newGlobalCode: {
              ...code.dataValues,
              user: this.context.user,
            },
          });
        });
      } else {
        const alert = await this.store.Alert.create({
          userId: this.context.user.id,
          groupId: alertObj.groupIds[0],
          codeId: alertObj.codeId,
          title: alertObj.title,
          text: alertObj.text,
          image: alertObj.image,
          upvotes: 0,
          downvotes: 0,
        });
        const code = await this.store.Code.findOne({
          where: { id: alertObj.codeId },
        });
        pubsub.publish(NEW_GROUP_ALERT, {
          groupId: alertObj.groupIds[0],
          newGroupAlert: {
            ...alert.dataValues,
            user: this.context.user,
          },
        });
        pubsub.publish(NEW_GLOBAL_CODE, {
          newGlobalCode: {
            ...code.dataValues,
            user: this.context.user,
          },
        });
      }
      return {
        code: '',
        success: true,
        message: 'Alert sent',
        errors: '',
      };
    } catch (err) {
      return {
        code: '',
        success: false, 
        message: 'Alert error',
        errors: err,
      };
    }
  }
}

module.exports = AlertAPI;
