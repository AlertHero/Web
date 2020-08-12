const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const colors = require('colors');
const logger = require('morgan');
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

require('dotenv').config({ silent: true });
const getModels = require('./data/models');
const seed = require('./seeders');
const { refreshTokens } = require('./utils/auth');

// generate schema with tyoeDefs and resolvers from respective folders
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './data/schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './data/resolvers')));
const schema = makeExecutableSchema({ typeDefs, resolvers });
// Terminal Colors Themes
colors.setTheme({
  error: 'red',
  warn: 'yellow',
  link: ['cyan', 'underline'],
  info: ['white', 'bold'],
});

// Initialize Express Server
const app = express();
app.use(logger('dev'));
app.use(helmet());

// Enable the server to receive requests from the  React app when running locally.
const isNotProduction = process.env.NODE_ENV !== 'production';
if (isNotProduction) {
  app.use('*', cors({ origin: 'http://localhost:3000' }));
}

// Function used to handle user's tokens
app.use(async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, process.env.SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      console.log(models);
      const newTokens = await refreshTokens(token, refreshToken, models, process.env.SECRET, process.env.SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
});

// Initialize Graphql with our schema, models, and user context
app.use('/graphql', bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user,
      SECRET: process.env.SECRET,
      SECRET2: process.env.SECRET2,
    },
  })),
);

// Setup Apollo graphiql for testing and webSocket for subscriptions
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://${process.env.HOST}:${process.env.PORT}/subscriptions`,
}));
// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.use('/*', express.static(path.join(__dirname, './build')));

// Create http server
const server = createServer(app);
getModels().then((models) => {
  if (!models) {
    console.log('Could not connect to db');
    return;
  }

  // Sync database then seed and then start SubscriptionServer
  models.sequelize.sync({ force: true }).then(() => {
    seed(models).then(() => {
      console.log('📡  Server is live!'.info);
      console.log('GraphiQL is now running on:', `http://${process.env.HOST}:${process.env.PORT}/graphiql`.link);
      server.listen(process.env.PORT, () => {
        new SubscriptionServer({
          execute,
          subscribe,
          schema,
          onConnect: async ({ token, refreshToken }) => {
            if (token && refreshToken) {
              try {
                const { user } = jwt.verify(token, process.env.SECRET);
                return { models, user };
              } catch (err) {
                const newTokens = await refreshTokens(token, refreshToken, models, process.env.SECRET, process.env.SECRET2);
                return { models, user: newTokens.user };
              }
            }
            return { models };
          },
        }, {
          server,
          path: '/subscriptions',
        });
      });
    });
  });
});
