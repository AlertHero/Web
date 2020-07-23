import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { Doughnut } from 'react-chartjs-2';

class Chart extends React.Component {
  state = {
    stats: { active: 0, totatl: 0 },
    messages: { severe: null, elevated: null, low: null },
    userData: {
      labels: ['Active', 'Inside Hospital'],
    },
    messagesData: {
      labels: ['Severe', 'Elevated', 'Low', 'Behavior'],
    },
  };
  componentWillMount() {
    if (this.props.theme === 'dark') {
      this.setState({ fontColor: '#fff', borderColor: '#616161' });
    } else {
      this.setState({ fontColor: '#000', borderColor: '#ffffff' });
    }
  }
  componentWillReceiveProps({
    stats, messages, theme,
  }) {
    if (stats) { this.setState({ stats }); }
    if (messages) { this.setState({ messages }); }
    if (theme) {
      if (theme === 'dark') {
        this.setState({ fontColor: '#fff', borderColor: '#616161' });
      } else {
        this.setState({ fontColor: '#000', borderColor: '#ffffff' });
      }
    }
  }

  render() {
    const {
      messages: {
        severe, elevated, low, behavior,
      },
      fontColor, borderColor, userData, messagesData, stats,
    } = this.state;
    const options = {
      animation: {
        cutoutPercentage: 50, 
        animateScale: true,
        animateRotate: true,
        easing: 'easeOutBounce',
      },
      cutoutPercentage: [65],
      title: {
        display: false,
      },
      legend: {
        display: true,
        position: 'right',
        labels: { fontSize: 17, fontColor },
      },
    };
    return (
      <div className="chart">
        <Row>
          <Col span={12}>
            <Doughnut
              data={{
                ...userData,
                datasets: [{
                  borderColor,
                  backgroundColor: ['#3366cc', '#990099'],
                  data: [stats.active, stats.total],
                }],
              }}
              options={options}
            />
          </Col>
          <Col span={12}>
            <Doughnut
              data={{
                ...messagesData,
                datasets: [{
                  borderColor,
                  backgroundColor: ['#ff4d4f', '#ffec3d', '#73d13d', '#9254de'],
                  data: [severe, elevated, low, behavior],
                }],
              }}
              options={options}
            />
          </Col>
        </Row>
      </div>

    );
  }
}
Chart.propTypes = {
  theme: PropTypes.string.isRequired,
};

// ///graphs implement user graphs and app user per user for top ten users//
// // Top Sets =  total user, users available, number of severe codes sent, compared to last week.
export default Chart;
