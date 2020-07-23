import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import { Row } from 'antd';
import Card from '../messages/Card';
import '../../styles/loading_cube.css';

import MESSAGES_QUERY from '../../graphql/queries/messages';
import MESSAGE_SUBSCRIPTION from '../../graphql/subscriptions/messages';

class MessageStats extends React.Component {
  state = {
    hasMore: true, 
    messagesRelay: [],
  };
  componentWillMount() {
    this.unsubscribe = this.subscribe(1);
  }
  componentWillReceiveProps({ messagesRelay }) {
    if (messagesRelay) {
      this.setState({ messagesRelay });
    }
  }
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  subscribe = (channelId) => {
    this.props.subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        if (!data) {
          return prev;
        }
        const newMessage = data.newChannelMessage;
        return update(prev, {
          messagesRelay: {
            edges: {
              $unshift: [{
                __typename: prev.messagesRelay.typename,
                node: newMessage,
                cursor: newMessage.id.toString().toString('base64'),
              }],
            },
          },
        });
      },
    });
  }

  render() {
    const { fetchMore } = this.props;
    const { messagesRelay, hasMore } = this.state;
    return (
      <div className="messageUpdate">
        { !messagesRelay.edges ? (
          <div>
            <div className="folding-cube">
              <div className="cube1 cube" />
              <div className="cube2 cube" />
              <div className="cube4 cube" />
              <div className="cube3 cube" />
            </div>
          </div>
        ) : (
          <div>
            <div className="chartHeadWraper">
              <Row className="chartHeader">
                <h1 className="chartText">Recent Messages <span><a href="/messages">More</a></span></h1>
              </Row>
            </div>
            <Card
              hasMore={hasMore}
              fetchMore={fetchMore}
              messages={messagesRelay}
              channelId="1"
            />
          </div>
        )}
      </div>
    );
  }
}
MessageStats.propTypes = {
  fetchMore: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
};

const messagesQuery = graphql(MESSAGES_QUERY, {
  options: () => ({ variables: { last: 15, after: '', channelId: 1, }, fetchPolicy: 'network-only' }),
  props: ({ data: { fetchMore, loading, messagesRelay, refetch, subscribeToMore } }) => ({
    loading, messagesRelay, fetchMore, refetch, subscribeToMore,
  }),
});

export default compose(messagesQuery)(MessageStats);
