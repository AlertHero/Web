import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Row, Input, Button, Select, Form, Dropdown, Icon, Menu } from 'antd';

import CREATE_MESSAGE_MUTATION from '../../graphql/mutations/create-message';

const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
class FormClass extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    await this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { channels, text, code } = values;
        if (!text || !text.trim()) {
          return;
        }
        await this.props.createMessage({ text, channelId: channels, codeId: code });
      } else {
        console.log('Error ', err);
      }
    });
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const options = this.props.channels.map(c => (<Option key={c.id} value={c.id}>{c.name}</Option>)); // eslint-disable-line max-len
    const menu = (
      <Menu>
        <Menu.Item key="0">1st menu item</Menu.Item>
        <Menu.Item key="1">2nd menu item</Menu.Item>
        <Menu.Item key="3">3rd menu item</Menu.Item>
      </Menu>
    );
    return (
      <div className="message-input">
        <Row className="message-formRow">
          <FormItem className="message-code">
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">Select a Code <Icon type="down" />
              </a>
            </Dropdown>
          </FormItem>
          <FormItem className="message-group">
            {getFieldDecorator('channels', {
              rules: [
                { required: true, message: 'Please select a group', type: 'array' },
              ],
            })(<Select mode="multiple" style={{ width: '100%' }} placeholder="Which group is this being sent to?">{options}</Select>)}
          </FormItem>
        </Row>
        <Row className="message-formRow">
          <FormItem className="text-input">
            {getFieldDecorator('text')(<TextArea placeholder="Send a new message" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </FormItem>
          <Button type="primary" className="message-submit" onClick={this.handleSubmit}>
            Send
          </Button>
        </Row>
      </div>
    );
  }
}
FormClass.propTypes = {
  form: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  channels: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const FormCreated = Form.create()(FormClass);

const message = graphql(CREATE_MESSAGE_MUTATION, {
  props: ({ mutate }) => ({
    createMessage: ({ channelId, text, codeId }) =>
      mutate({
        variables: { channelId, text, codeId },
      }),
  }),
});

export default compose(message)(FormCreated);
