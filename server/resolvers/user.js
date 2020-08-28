const { requiresAdmin, requiresAuth } = require('../utils/permissions');

module.exports = {
  DatabaseResponse: {
    __resolveType(dbresp) {
      if (dbresp.user) {
        return 'UserResponse';
      }
      if (dbresp.group) {
        return 'GroupResponse';
      }

      return null;
    },
  },
  User: {
    alerts: async({ id }, __, { dataSources }) => {
      return await dataSources.alertAPI.getUserAlerts({ id });
    },
    groups: async ({ id }, __, { dataSources }) => {
      return await dataSources.userAPI.getGroups(id);
    },
    isAdmin: async ({ role }, __, {}) => {
      // Check role and asign admin boolean
      return role == 2 ? true : false;
    },
  },
  Query: {
    me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findUser(),
    getUser: requiresAuth.createResolver( async (_, { id }, { dataSources }) =>
      dataSources.userAPI.findUser({ id }),
    ),
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources }) => {
      const userResponse = await dataSources.userAPI.tryLogin({
        email,
        password,
      });
      return userResponse;
    },
    updateUser: requiresAuth.createResolver( async (_, args, { dataSources }) => {
      return await dataSources.userAPI.update(args);
    }),
    bulkCreateUsers: requiresAdmin.createResolver( async (_, users, { dataSources }) => {
      return await dataSources.userAPI.createMultiple(users);;
    }),
    createUser: requiresAdmin.createResolver( async (_, args, { dataSources }) => {
      return await dataSources.userAPI.createUser(args);
    }),
    deleteUser: requiresAdmin.createResolver( async(_, { id }, { dataSources }) => {
      return await dataSources.userAPI.destroyUser(id);
    }),
  },
};
