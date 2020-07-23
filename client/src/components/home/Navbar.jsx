import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Avatar, Menu, Dropdown, Form, Switch, Icon, Button } from 'antd';
import avatarLogo from '../../images/Mtsinai.png';

const { Header } = Layout;
class NavbarClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: {
        desc: 'Loading',
        color: '',
      },
      visible: false,
    };

    this.logout = this.logout.bind(this);
  }
  componentWillMount() {
    const { codes } = this.props;
    if (codes) {
      const activeCode = codes.filter(code => code.isActive === true);
      this.setState({
        codes,
        code: activeCode[0],
      });
    }
  }
  componentWillReceiveProps({codes}) {
    if (codes) {
      const activeCode = codes.filter(code => code.isActive === true);
      this.setState({
        codes,
        code: activeCode[0],
      });
    }
  }
  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

        console.log('Received values of form: ', values);
      }
    });
    this.setState({ confirmLoading: true });
    setTimeout(() => {
      this.setState({
        modalVisible: false,
        confirmLoading: false,
      });
    }, 1000);
  }
  logout = async () => {
    await localStorage.clear();
    await this.props.history.push('/');
  }

  render() {
    const { code } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <h2>Mt. Sinai</h2>
        </Menu.Item>
        <Menu.Item>
          <h3> Toggle Theme&nbsp;
            <Switch
              checked={this.props.theme === 'dark'}
              onChange={this.props.toggleTheme}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </h3>
        </Menu.Item>
        <Menu.Item>
          <Button type="primary" icon="poweroff" onClick={this.logout}>Logout</Button>
        </Menu.Item>
      </Menu>
    );

    return (
      <Header className="header">
        <div className="menu_elements-right">
          <div className="codeNav">
            <h4 className="code-text">Code:&nbsp; {code.desc} </h4>
            <Avatar size="small" style={{ backgroundColor: code.color }} className="code-avatar" />
          </div>
          <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
            <div>
              <Avatar className="user-avatar" size="large" src={avatarLogo} />
              <Icon type="down" />
            </div>
          </Dropdown>
        </div>
      </Header>
    );
  }
}
NavbarClass.propTypes = {
  form: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  theme: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  toggleTheme: PropTypes.func.isRequired,
};

const Navbar = Form.create()(NavbarClass);

export default Navbar;
