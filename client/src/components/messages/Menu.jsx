import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

class MenuClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: ['0'],
      channels: this.props.channels,
    };
    this.updateSelection = this.updateSelection.bind(this);
  }
  componentWillMount() {
    this.toggleSelect(this.props.currentChannel.id);
  }
  componentWillReceiveProps({ channels, currentChannel }) {
    if (currentChannel) {
      this.toggleSelect(currentChannel.id);
    }
    if (channels) {
      this.setState({ channels });
    }
  }
  toggleSelect = (id) => {
    this.setState({ selected: [id.toString()] });
  }
  updateSelection(selectedChannel) {
    const { id, children } = selectedChannel.item.props.children.props.children[1].props;
    const channel = { id: id.toString(), name: children };
    this.props.updateChannel(channel);
  }

  render() {
    const { selected, channels } = this.state;
    const menuGroup = channels.map((channel, i) => (
      <Menu.Item key={channel.id}>
        <Link id={`${channel.id}`} href={`/messages/${channel.id}`} to={`/messages/${channel.id}`}> <span id={channel.id}>{channel.name}</span> </Link>
      </Menu.Item>
    ));
    return (
      <div className="msg-menu">
        <Menu
          mode="horizontal"
          theme={this.props.theme}
          defaultSelectedKeys={selected}
          onClick={this.updateSelection}
        >
          {menuGroup}
        </Menu>
      </div>
    );
  }
}
MenuClass.propTypes = {
  theme: PropTypes.string.isRequired,
  channels: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  updateChannel: PropTypes.func.isRequired,
  currentChannel: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default MenuClass;
