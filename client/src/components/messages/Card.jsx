import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import InfiniteScroll from 'react-infinite-scroller';
import { Row, Card, Spin, notification } from 'antd';
import Post from './Post';

class CardClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: props.hasMore,
      messages: props.messages.edges,
      testMsg: {
        id: 1,
        text: 'There are no Messages in this channel yet',
        createdAt: new Date(),
        code: {
          desc: 'Severe',
          color: '#f5222d',
        },
        user: {
          firstName: 'System',
          lastName: 'Alert',
        },
      },
    };
    this.loadMoreHistory = this.loadMoreHistory.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.hasMore) {
      this.setState({ hasMore: nextProps.hasMore });
      if (this.props.channelId !== nextProps.channelId) {
        this.chatList.scrollTop = 0;
      }
    }
    if (nextProps.messages.edges !== this.props.messages.edges) {
      this.setState({ messages: nextProps.messages.edges });
    }
  }
  loadMoreHistory() {
    const { messages, fetchMore, channelId } = this.props;
    fetchMore({
      variables: {
        last: 15,
        channelId,
        after: messages.edges[messages.edges.length - 1].cursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return previousResult; }
        return update(previousResult, {
          messagesRelay: {
            edges: { $push: fetchMoreResult.messagesRelay.edges },
            pageInfo: { $set: fetchMoreResult.messagesRelay.pageInfo },
          },
        });
      },
    }).then((res) => {
      if (res.data.messagesRelay.edges.length === 0) {
        this.setState({ hasMore: false });
        notification.open({
          duration: 3,
          placement: 'topRight',
          message: 'No More Messages',
        });
      }
    });
  }

  render() {
    const { hasMore, testMsg, messages } = this.state;
    const chatList = messages.map(m => (<Post key={m.node.id} message={m.node} />));
    return (
      <Row>
        <div className="message-card">
          <Card bordered={false}>
            <div ref={(ref) => { this.chatList = ref; }} className="chatList">
              <InfiniteScroll
                useWindow={false}
                threshold={150}
                pageStart={0}
                loadMore={this.loadMoreHistory}
                hasMore={messages.length === 0 ? false : hasMore}
                loader={<div className="loader"><Spin /></div>}
              >
                {messages.length === 0 ? <Post key={testMsg.id} message={testMsg} /> : chatList}
              </InfiniteScroll>
            </div>
          </Card>
        </div>
      </Row>
    );
  }
}
CardClass.propTypes = {
  hasMore: PropTypes.bool.isRequired,
  fetchMore: PropTypes.func.isRequired,
  messages: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  channelId: PropTypes.string.isRequired,
};

export default CardClass;
