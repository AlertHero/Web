const { requiresAdmin, requiresAuth } = require('../utils/permissions');

module.exports = {
  Group: {
    members: async ({ id }, __, { dataSources }) => {
      return await dataSources.groupAPI.getMembers({id});
    },
  },
  Query: {
    getGroup: requiresAuth.createResolver(async (_, { id }, { dataSources }) => 
      dataSources.groupAPI.findGroup({ id })
    ),
    getAllGroups: requiresAuth.createResolver(async (_, __, { dataSources }) =>
      dataSources.groupAPI.getGroups()
    ),
  },
  Mutation: {
    addMember: requiresAuth.createResolver(
      async (_, args, { dataSources }) => {
        return await dataSources.groupAPI.addMember(args);
      }
    ),
    createGroup: requiresAdmin.createResolver(
      async (_, group, { dataSources }) => {
        return await dataSources.groupAPI.createGroup(group);
      }
    ),
  },
};
