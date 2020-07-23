import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { graphql, compose } from 'react-apollo';
import Chart from '../components/dashboard/Chart';
import TopSets from '../components/dashboard/TopSets';
import MessageStats from '../components/dashboard/Messages';
import '../styles/dashboard.css';

import { USERS_STATS_QUERY } from '../graphql/queries/users';
import { MESSAGES_CODES_QUERY } from '../graphql/queries/messages';

class Dashboard extends React.Component {
  state = {
    messages: { severe: null },
    time: new Date().toLocaleString(),
  };
  componentDidMount() {
    this.clock = setInterval(() => this.tick(), 1000);
  }
  componentWillReceiveProps({ getStats, codesOfMessages }) {
    if (getStats) { this.setState({ getStats }); }
    if (codesOfMessages) {
      const msgRatio = Object.values(codesOfMessages);
      const msgArray = msgRatio.filter(val => isNaN(val) === false);
      const reducer = (accumulator, currentValue) => parseInt(accumulator, 10) + parseInt(currentValue, 10);
      const msgTotal = msgArray.reduce(reducer);
      this.setState({
        messages: codesOfMessages,
        msgTotal,
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.clock);
  }
  tick = () => {
    const time = new Date().toLocaleString();
    this.setState({ time });
  }

  render() {
    const { theme } = this.props;
    const {
      time, messages, getStats, msgTotal,
    } = this.state;
    return (
      <div className="app-content">
        <div className="dashboard">
          <TopSets
            time={time}
            stats={getStats}
            totalMessages={msgTotal}
            severeMessages={messages.severe}
          />
          <Row>
            <Col sm={5} md={10} lg={24}>
              <Chart
                theme={theme}
                messages={messages}
                stats={getStats}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={5} md={10} lg={24}>
              <MessageStats />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  theme: PropTypes.string.isRequired,
};

const userStatsQuery = graphql(USERS_STATS_QUERY, {
  props: ({ data: { loading, getStats } }) => ({
    loading, getStats,
  }),
});
const codesOfMsgs = graphql(MESSAGES_CODES_QUERY, {
  props: ({ data: { loading, codesOfMessages } }) => ({
    loading, codesOfMessages,
  }),
});

export default compose(
  userStatsQuery,
  codesOfMsgs,
)(Dashboard);
