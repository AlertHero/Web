const { requiresAdmin, requiresAuth } = require('../utils/permissions');

module.exports = {
  DatabaseResponse: {
    __resolveType(dbresp) {
      if (dbresp.user) {
        return 'UserResponse';
      }

      return null;
    },
  },
  User: {
    isAdmin: async (user, __, {}) => {
      // Check role and asign admin boolean
      return user.role == 2 ? true : false;
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
      const userResponse = await dataSources.userAPI.update(args);
      return userResponse;
    }),
    bulkCreateUsers: requiresAdmin.createResolver( async (_, args, { dataSources }) => {
      const dbResponse = await dataSources.userAPI.createMultiple(args);
      return dbResponse;
    })
  },
};
