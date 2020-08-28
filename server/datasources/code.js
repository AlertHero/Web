const { DataSource } = require('apollo-datasource');

class CodeAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async getStatus({ id }) {
    const code = await this.store.Code.findOne({ where: { id } });
    return code.isActive;
  }

  async getActiveCode() {
    return await this.store.Code.findOne({ where: { isActive: true } });
  }

  async getAllCodes() {
    return await this.store.Code.findAll();
  }

  async createCode({ desc, color }) {
    return await this.store.Code.create({
      desc,
      color,
      isActive: false,
    });
  }

}

module.exports = CodeAPI;
