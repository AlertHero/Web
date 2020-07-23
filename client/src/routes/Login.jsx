import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Layout, Form, Input, Button, Icon, Row, Col, Card } from 'antd';
import { wsLink } from '../apollo';
import LOGIN_MUTATION from '../graphql/login.mutation';
import logo from '../images/alert_hero(clear).png';
import '../styles/login.css';

const { Footer, Content } = Layout;
const FormItem = Form.Item;
class Login extends React.Component {
  constructor(props) {
    super(props);
    const theme = localStorage.getItem('app_theme');
    this.state = {
      theme: (theme || 'light'),
    };
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { email, password } = values;
        const res = await this.props.login({ email, password });
        const {
          ok, token, errors, refreshToken,
        } = res.data.login;

        if (ok) {
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          wsLink.subscriptionClient.tryReconnect();
          this.props.history.push('/');
        } else {
          const err = [];
          errors.forEach(({ path, message }) => {
            err[path] = message;
          });
          this.props.form.setFields({
            email: {
              value: email,
              errors: [new Error(err.email)],
            },
            password: {
              value: password,
              errors: [new Error(err.password)],
            },
          });
        }
      }
    });
  }

  render() {
    const { theme } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={`${theme}-theme login`}>
        <Layout style={{ height: '100vh' }}>
          <Content>
            <Row type="flex" justify="center" align="middle" style={{ height: '80vh' }}>
              <Col span={10} className="login-container">
                <Card title={<div><img src={logo} className="app-logo" alt="alert-hero logo" /><h1 className="title-text center">Alert<span>Hero</span></h1></div>} className="login-card">
                  <Form onSubmit={this.handleSubmit} className="login-form">
                    <Row>
                      <FormItem>
                        {getFieldDecorator('email', { rules: [{ required: true, message: 'Please input your email' }] })(<Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="Email" />)}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('password', { rules: [{ required: true, message: 'Please input your Password!' }] })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />)}
                      </FormItem>
                    </Row>
                    <Row className="center">
                      <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                          LOGIN
                        </Button>
                      </FormItem>
                    </Row>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Content>
          <Footer> &copy; 2017 Alert Hero </Footer>
        </Layout>
      </div>
    );
  }
}
Login.propTypes = {
  form: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const LoginForm = Form.create()(Login);
const login = graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    login: ({ email, password }) =>
      mutate({
        variables: { email, password },
      }),
  }),
});

export default compose(login)(LoginForm);
