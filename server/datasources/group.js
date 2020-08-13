const { DataSource } = require('apollo-datasource');

class GroupAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

}

module.exports = GroupAPI;