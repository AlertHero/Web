import React from 'react';
import PropTypes from 'prop-types';
import { Col, Layout } from 'antd';
import { graphql, compose } from 'react-apollo';
import Search from '../components/users/Search';
import Table from '../components/users/Table';
import '../styles/users.css';
import '../styles/loading_cube.css';

import { ALL_USERS_QUERY } from '../graphql/queries/users';

const { Content } = Layout;
class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dataSource: {},
    };
  }
  componentWillMount = () => {
    this.tableData(this.props.allUsers);
  }
  componentWillReceiveProps({ allUsers }) {
    this.tableData(allUsers);
  }
  onSearch = () => {
    const { searchText, dsOg } = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      dataSource: dsOg.map((record) => {
        const match = record.name.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
        };
      }).filter(record => !!record),
    });
  }
  onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }
  clearSearch = () => {
    const { dsOg } = this.state;
    this.setState({ searchText: '', dataSource: dsOg });
  }
  tableData = (allUsers) => {
    if (allUsers) {
      const arr = this.convertData(allUsers);
      this.setState({
        data: arr[0],
        dataSource: arr[1],
        dsOg: arr[1],
      });
    }
  }
  convertData = (users) => {
    const data = users.map((user) => {
      const newUser = {
        key: (user.id).toString(),
        id: { value: (user.id).toString() },
        name: { value: `${user.firstName} ${user.lastName}`, editable: false },
        phone: { value: this.phoneFormat(user.phone), editable: false },
        group: { value: user.group.name, editable: false, type: 'select-group' },
        employed: { value: user.workingNow },
        workingNow: { value: user.employed },
      };
      return (newUser);
    });
    const dataSource = data.map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value;
      });
      return obj;
    });
    return [data, dataSource];
  }
  phoneFormat = (phone) => {
    const areaCode = (`${phone}`).replace(/\D/g, '');
    const number = areaCode.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!number) ? '' : `(${number[1]})-${number[2]}-${number[3]}`;
  }

  render() {
    const { loading } = this.props;
    const { data, dataSource } = this.state;
    return (
      <div className="app-content">
        <Col className="users-container" span={24}>
          <Layout>
            <Search onSearch={this.onSearch} onInputChange={this.onInputChange} value={this.state.searchText} />
            <Content className="user-content">
              {loading ? (
                <div className="folding-cube">
                  <div className="cube1 cube" />
                  <div className="cube2 cube" />
                  <div className="cube4 cube" />
                  <div className="cube3 cube" />
                </div>
              ) : (
                <Table data={data} dataSource={dataSource} clearSearch={this.clearSearch} />
              )}
            </Content>
          </Layout>
        </Col>
      </div>
    );
  }
}
Users.defaultProps = {
  allUsers: [],
};
Users.propTypes = {
  loading: PropTypes.bool.isRequired,
  allUsers: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

const usersQuery = graphql(ALL_USERS_QUERY, {
  props: ({ data: { loading, allUsers } }) => ({
    loading, allUsers,
  }),
});

export default compose(usersQuery)(Users);
