require('dotenv').config();

const path = require('path');
const colors = require('colors');
const { merge } = require('lodash');
const { ApolloServer } = require('apollo-server');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');

const seed = require('./seeders');
const { createStore } = require('./db');
const { getUser } = require('./utils/auth');

// Schema files
const typesArray = loadFilesSync(path.join(__dirname, './schema'));
const typeDefs = mergeTypeDefs(typesArray, { all: true });

// Resolvers
const indexResolvers = require('./resolvers');
const userResolvers = require('./resolvers/user');
const resolvers = merge(indexResolvers, userResolvers);

const UserAPI = require('./datasources/user');
const GroupAPI = require('./datasources/group');

// Terminal Colors Themes
colors.setTheme({
  error: 'red',
  warn: 'yellow',
  link: ['cyan', 'underline'],
  info: ['white', 'bold'],
});

// creates a sequelize connection to the database.
createStore().then((models) => {
  if (!models) {
    console.log('Could not create store from db models'.error);
    return;
  } else {
    // Create our Apollo server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        userAPI: new UserAPI({ store: models }),
        groupAPI: new GroupAPI({ store: models }),
      }),
      context: async ({ req }) => {
        // Get the user token from the headers.
        const token = req.headers.authorization || '';
        const Rtoken = req.headers['x-refresh-token'] || '';

        // Try to retrieve a user with the token
        const user = await getUser(token, Rtoken, models);

        // add the user to the context
        return {
          user: (!user) ? null : user, 
          SECRET: process.env.SECRET,
          SECRET2: process.env.SECRET2,
        };
      },
    });
    // Sync database ( force == new db tables )
    models.sequelize.sync({ force: true }).then(() => {
      // Seed database from functions in seeders dir
      seed(models).then(() => {
        console.log('📡  Server is live!'.info);
        // Start our server if we're not in a test env.
        // if we're in a test env, we'll manually start it in a test
        if (process.env.NODE_ENV !== 'test') {
          server
            .listen({ port: process.env.PORT || 4000 })
            .then(({ url }) => {
              console.log('🚀 app running at ' + `${url}`.link)
            });
        }
        return;
      });
    });
  }
});