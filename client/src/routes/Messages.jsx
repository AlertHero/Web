import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { graphql, compose } from 'react-apollo';
import { Row, Col, Layout } from 'antd';
import Card from '../components/messages/Card';
import Menu from '../components/messages/Menu';
import Form from '../components/messages/Form';
import '../styles/messages.css';
import '../styles/loading_cube.css';

import ALL_CHANNELS_QUERY from '../graphql/queries/channels';
import MESSAGES_QUERY from '../graphql/queries/messages';
import MESSAGE_SUBSCRIPTION from '../graphql/subscriptions/messages';

const { Content } = Layout;
class Messages extends React.Component {
  constructor(props) {
    super(props);
    let id = '';
    if (props.match.params.channelId === undefined) {
      id = '1';
    } else {
      id = props.match.params.channelId;
    }
    this.state = {
      channels: [],
      hasMore: true,
      currentChannel: { id },
    };
  }
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.state.currentChannel.id);
  }
  componentWillReceiveProps({ allChannels, messagesRelay, match: { params: { channelId } } }) {
    if (allChannels) {
      this.setState({ channels: allChannels });
    }
    if (messagesRelay) {
      this.setState({ messagesRelay });
    }
    if (this.state.currentChannel.id !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }
  }
  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  updateChannel = async (channel) => {
    this.setState({ currentChannel: channel, hasMore: true });
  }
  subscribe = (channelId) => {
    this.props.subscribeToMore({
      document: MESSAGE_SUBSCRIPTION,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData: { data } }) => {
        if (!data) {
          return prev;
        }
        const newMessage = data.newChannelMessage;
        return update(prev, {
          messagesRelay: {
            edges: {
              $unshift: [{
                __typename: prev.messagesRelay.__typename, // eslint-disable-line 
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
    const { theme, fetchMore } = this.props;
    const {
      currentChannel, channels, messagesRelay, hasMore,
    } = this.state;
    return (
      <div className="app-content">
        <Row>
          <Col span={24} className="message-container">
            <Row>
              <Content>
                <Col span={24}>
                  <Menu
                    theme={theme}
                    channels={channels}
                    currentChannel={currentChannel}
                    updateChannel={this.updateChannel}
                  />
                  { !messagesRelay ? (
                    <div style={{ maxHeight: '60vh', minHeight: '60vh' }}>
                      <div className="folding-cube">
                        <div className="cube1 cube" />
                        <div className="cube2 cube" />
                        <div className="cube4 cube" />
                        <div className="cube3 cube" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Card
                        hasMore={hasMore}
                        fetchMore={fetchMore}
                        messages={messagesRelay}
                        channelId={currentChannel.id}
                      />
                    </div>
                  )}
                  <Form channels={channels} channelId={currentChannel.id} />
                </Col>
              </Content>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
Messages.propTypes = {
  theme: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchMore: PropTypes.func.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
};


const channelsQuery = graphql(ALL_CHANNELS_QUERY, {
  props: ({ data: { loading, allChannels } }) => ({
    loading, allChannels,
  }),
});
const messagesQuery = graphql(MESSAGES_QUERY, {
  options: ({ match: { params: { channelId } } }) => ({ variables: { last: 15, after: '', channelId: channelId || 1 }, fetchPolicy: 'network-only' }),
  props: ({
    data: {
      fetchMore, loading, messagesRelay, refetch, subscribeToMore,
    },
  }) => ({
    loading, messagesRelay, fetchMore, refetch, subscribeToMore,
  }),
});

export default compose(
  messagesQuery,
  channelsQuery,
)(Messages);
