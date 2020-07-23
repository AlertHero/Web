import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import 'antd/dist/antd.css';
import Routes from './routes';
import client from './apollo';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
