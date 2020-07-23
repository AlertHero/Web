import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon } from 'antd';

const TopSets = ({
  time, stats, severeMessages,
}) => (
  <div className="setsWrapper">
    <div className="chartHeadWraper">
      <Row className="chartHeader">
        <h1 className="chartText">Hospital Activities <span>{time}</span></h1>
      </Row>
    </div>
    <Row className="topSets" type="flex" justify="space-around">
      <Col className="tiles" span={6}>
        <p className="tileTitle"><Icon className="Icons" type="user" />Total Users</p>
        <p className="totalStats">{stats.total}</p>
      </Col>
      <Col className="tiles" span={6}>
        <p className="tileTitle"><Icon className="Icons" type="user" />Active Users</p>
        <p className="totalStats">{stats.active}</p>
      </Col>
      <Col className="tiles" span={6}>
        <p className="tileTitle"><Icon className="Icons" type="exclamation-circle-o" />Severe Codes Sent</p>
        <p className="totalStats">{severeMessages}</p>
      </Col>
      <Col className="tiles" span={6}>
        <p className="tileTitle"><Icon className="Icons" type="mobile" />Version</p>
        <p className="totalStats"> 1.0.1-beta </p>
      </Col>
    </Row>
  </div>
);
TopSets.defaultProps = {
  time: '',
  stats: {},
  severeMessages: '',
};
TopSets.propTypes = {
  time: PropTypes.string,
  stats: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  severeMessages: PropTypes.string,
};

export default TopSets;
