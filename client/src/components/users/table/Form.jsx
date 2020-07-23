import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Tooltip, Icon, Select, Modal } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const formItemHalfLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
const FormComponent = ({
  visible, onCancel, onCreate, confirmLoading, form: { getFieldDecorator },
}) => (
  <div>
    <Modal
      title="Create User(s)"
      width="70%"
      visible={visible}
      onOk={onCreate}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
    >
      <Row>
        <div>
          <Form>
            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemHalfLayout}
                  hasFeedback
                  label={(
                    <span>
                      Name&nbsp;
                      <Tooltip title="Name of User">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      type: 'string', required: true, message: 'User must have a name', whitespace: true,
                    }],
                  })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="John Doe" />)}
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem
                  {...formItemHalfLayout}
                  hasFeedback
                  label={(
                    <span>
                      Phone&nbsp;
                      <Tooltip title="Phone Number">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                >
                  {getFieldDecorator('phone', {
                    rules: [{
                      type: 'string', required: true, message: 'User must have a phone number', whitespace: true,
                    }],
                  })(<Input prefix={<Icon type="phone" style={{ fontSize: 13 }} />} placeholder="(555)-555-5555" maxLength="9" />)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem
                  {...formItemHalfLayout}
                  hasFeedback
                  label={(
                    <span>
                      Title&nbsp;
                      <Tooltip title="Title?">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                >
                  {getFieldDecorator('title', {
                    rules: [{ required: false, message: 'Please', whitespace: true }],
                  })(<Select placeholder="Please select a title">
                    <Option value="Dr.">Dr.</Option>
                    <Option value="Mr.">Mr.</Option>
                    <Option value="Mrs.">Mrs.</Option>
                    <Option value="Ms.">Ms.</Option>{
                      // eslint-disable-next-line react/jsx-closing-tag-location
                    }</Select>)}
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem
                  {...formItemHalfLayout}
                  hasFeedback
                  label={(
                    <span>
                      Group&nbsp;
                      <Tooltip title="Group?">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                >
                  {getFieldDecorator('group', {
                    rules: [{ required: false, message: 'Please !', whitespace: true }],
                  })(<Select placeholder="Please select a type">
                    <Option value="doctor">Doctor</Option>
                    <Option value="resident">Resident</Option>
                    <Option value="nurse">Nurse</Option>
                    <Option value="nms">Non-Medical Staff</Option>{
                      // eslint-disable-next-line react/jsx-closing-tag-location
                    }</Select>)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Row>
    </Modal>
  </div>
);
FormComponent.defaultProps = {
  confirmLoading: false,
};
FormComponent.propTypes = {
  form: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  confirmLoading: PropTypes.bool,
};


const FormCreated = Form.create({})(FormComponent);

export default FormCreated;
