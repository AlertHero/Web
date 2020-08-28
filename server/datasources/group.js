const { DataSource } = require('apollo-datasource');

class GroupAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getMembers({ id: groupId }) {
    return await this.store.Member.findAll({
      where: { groupId },
    }).then( async(members) => {
      return await members.map(async({ userId }) => {
        return await this.store.User.findOne({
          where: { id: userId },
        });
      });
    });
  }

  async findGroup({ id: groupId }) {
    return await this.store.Group.findOne({ where: { id: groupId } });
  }

  async getGroups() {
    return await this.store.Group.findAll();
  }

  async createGroup({ group: groupArg }) {
    const group = await this.store.Group.create({
      name: groupArg.name,
      public: groupArg.public,
    }).catch(err => {
      return {
        code: '',
        success: true,
        message: 'Group creation error...',
        errors: err,
      };
    });
    return {
      code: '',
      success: true,
      message: 'Group has been created',
      errors: [],
      group,
    };
  }

  async addMember({ email, groupId }) {
    const user = await this.store.User.findOne({ where: { email } });
    console.log(user.dataValues.id)
    return await this.store.Member.create({
      userId: user.dataValues.id,
      role: user.dataValues.role,
      groupId: groupId,
    }).then(() => {
      return {
        code: '',
        success: true,
        message: 'Member has been added',
        errors: [],
      };
    }).catch(err => {
      return {
        code: '',
        success: true,
        message: 'Member error...',
        errors: err,
      };
    });
  }
}

module.exports = GroupAPI;