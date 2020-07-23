import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Row, Col } from 'antd';
import '../styles/404.css';

const { Content } = Layout;
class FourO4 extends React.Component {
  goTo(e) {
    const url = e.target.value;
    return (this.props.history.push(`/${url}`));
  }
  render() {
    const { theme } = this.props;
    return (
      <Layout className={`${theme}-theme four0four`}>
        <Content>
          <div>
            <Row type="flex" justify="center" align="middle">
              <Col span={20}>
                <Row>
                  <div className="top-404">
                    <h1 className="mainTitle"><span>404</span> Page Not Found</h1>
                  </div>
                </Row>
                <Row>
                  <div className="bottom-404">
                    <Row>
                      <h1 style={{ fontWeight: 300 }}>Click on an icon to the left</h1>
                    </Row>
                  </div>
                </Row>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    );
  }
}
FourO4.propTypes = {
  theme: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default FourO4;
