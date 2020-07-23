import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

import logo from '../../images/alert_hero(clear).png';

const { Sider } = Layout;
class Sidebar extends React.Component {
  componentWillMount() {
    this.toggleSelect(this.props.location.pathname);
  }
  componentWillReceiveProps(nextProps) {
    this.toggleSelect(nextProps.location.pathname);
  }
  toggleSelect = (url) => {
    const path = url.split('/');
    switch (path[1]) {
      case 'messages':
        this.setState({ selected: ['2'] });
        break;
      case 'users':
        this.setState({ selected: ['3'] });
        break;
      default:
        this.setState({ selected: ['1'] });
    }
  }

  render() {
    const { theme, collapsed } = this.props;
    return (
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="sider_elements">
          <Icon
            className="menu-icon"
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.props.toggleCollapsed}
          />
          <img src={logo} className="app-logo" alt="alert-hero logo" />
          <h1 className="title-text">Alert<span>Hero</span></h1>
        </div>

        <div className="menu_div menuCol">
          <Menu
            mode="inline"
            theme={theme}
            defaultOpenKeys={['sub1']}
            inlineCollapsed={collapsed}
            defaultSelectedKeys={this.state.selected}
          >
            <Menu.Item key="1">
              <Icon type="area-chart" />
              <span>Dashboard</span>
              <Link to="/" href="/" />
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="mobile" />
              <span>Messages</span>
              <Link to="/messages" href="/messages" />
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="user" />
              <span>Users</span>
              <Link to="/users" href="/messages" />
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
    );
  }
}
Sidebar.propTypes = {
  theme: PropTypes.string.isRequired,
  collapsed: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  toggleCollapsed: PropTypes.func.isRequired,
};

export default withRouter(Sidebar);
