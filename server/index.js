require('dotenv').config();

const path = require('path');
const http = require('http');
const colors = require('colors');
const express = require('express');
const { merge } = require('lodash');
const { ApolloServer } = require('apollo-server-express');
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
const groupResolvers = require('./resolvers/group');
const alertResolvers = require('./resolvers/alert');
const codeResolvers = require('./resolvers/code');
const commentResolvers = require('./resolvers/comment');
const resolvers = merge(
  indexResolvers, 
  userResolvers,
  groupResolvers,
  alertResolvers,
  codeResolvers,
  commentResolvers,
);

const UserAPI = require('./datasources/user');
const GroupAPI = require('./datasources/group');
const AlertAPI = require('./datasources/alert');
const CodeAPI = require('./datasources/code');
const CommentAPI = require('./datasources/comment');
const app = express();

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
        alertAPI: new AlertAPI({ store: models }),
        codeAPI: new CodeAPI({ store: models }),
        commentAPI: new CommentAPI({ store: models }),
      }),
      context: async ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          return connection.context;
        } else {
          // Get the user token from the headers.
          const token = req.headers.authorization || '';
          const Rtoken = req.headers['x-refresh-token'] || '';

          // Try to retrieve a user with the token
          const user = await getUser(token, Rtoken, models);

          // add the user to the context
          return {
            user: !user ? null : user,
            SECRET: process.env.SECRET,
            SECRET2: process.env.SECRET2,
          };
        }
      },
    });
    // apply middleware to apollo server
    server.applyMiddleware({app});
    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);

    // Sync database ( force == new db tables )
    models.sequelize.sync({ force: true }).then(() => {
      // Seed database from functions in seeders dir
      seed(models).then(() => {
        // Start our server if we're not in a test env.
        // if we're in a test env, we'll manually start it in a test
        if (process.env.NODE_ENV !== 'test') {
          httpServer.listen({ port: process.env.PORT || 4000 }, () => {
            console.log(
              `🚀 Server ready at http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`
            );
            console.log(
              `📡 Subscriptions ready at ws://localhost:${process.env.PORT || 4000}${server.subscriptionsPath}`
            );
          })
        }
        return;
      });
    });
  }
});