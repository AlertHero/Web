import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Row, Col } from 'antd';
import { graphql, compose } from 'react-apollo';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';

import Sidebar from '../components/home/Sidebar';
import Navbar from '../components/home/Navbar';
import Dashboard from './Dashboard';
import Messages from './Messages';
import Users from './Users';
import Four04 from './404';
import '../styles/home.css';

import ALL_CODES_QUERY from '../graphql/code.query';

const { Content, Footer } = Layout;
class Home extends React.Component {
  constructor(props) {
    super(props);
    const menu = localStorage.getItem('app_menu');
    const theme = localStorage.getItem('app_theme');
    this.state = {
      theme: (theme || 'light'),
      collapsed: (menu !== 'true'),
    };
  }
  componentWillReceiveProps({ allCodes }) {
    if (allCodes) {
      this.setState({ codes: allCodes });
    }
  }
  toggleCollapsed = async () => {
    await this.setState({ collapsed: !this.state.collapsed });
    await localStorage.setItem('app_menu', !this.state.collapsed);
  }
  toggleTheme = async (value) => {
    await this.setState({ theme: value ? 'dark' : 'light' });
    await localStorage.setItem('app_theme', this.state.theme);
  }

  render() {
    const { theme, collapsed, codes } = this.state;
    return (
      <BrowserRouter>
        <div className={`${theme}-theme home`}>
          <Layout>
            <Sidebar theme={theme} collapsed={collapsed} toggleCollapsed={this.toggleCollapsed} />
            <Layout>
              <Navbar codes={codes} theme={theme} history={this.props.history} toggleTheme={this.toggleTheme} />
              <Content className="homeContent">
                <Row type="flex" justify="center">
                  <Col span={24}>
                    <Switch>
                      <Redirect from="/login" to="/" />
                      <Route exact path="/" render={props => <Dashboard {...props} theme={theme} />} />
                      <Route exact path="/messages/:channelId?" render={props => <Messages {...props} theme={theme} />} />
                      <Route exact path="/users" component={Users} />
                      <Route render={props => <Four04 {...props} theme={theme} />} />
                    </Switch>
                  </Col>
                </Row>
                <Footer className="footer"> &copy; 2017 Alert Hero </Footer>
              </Content>
            </Layout>
          </Layout>
        </div>
      </BrowserRouter>
    );
  }
}
// function that gets all codes i real time pull in like graphql example from mesages query
const codeQuery = graphql(ALL_CODES_QUERY, {
  props: ({ data: { loading, allCodes } }) => ({
    loading, allCodes,
  }),
});
Home.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default compose(codeQuery)(Home);
