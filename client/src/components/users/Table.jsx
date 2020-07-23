import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Row, Table, Button, Popconfirm, notification } from 'antd';
import Form from './table/Form';
import TableCell from './table/Tablecell';

import DELETE_USER_MUTATION from '../../graphql/mutations/delete-user';

class TableClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: props.data,
      sortedInfo: {
        columnKey: 'id',
        field: 'id',
        order: 'ascend',
      },
    };
    this.handleCreate = this.handleCreate.bind(this);
  }
  componentWillReceiveProps({ data }) {
    if (data) {
      this.setState({ data });
    }
  }
  setAgeSort = () => {
    this.setState({
      sortedInfo: { order: 'descend', columnKey: 'age' },
    });
  }
  clearAll = () => {
    this.setState({ filteredInfo: null, sortedInfo: null });
  }
  editDone(i, type) {
    const { data } = this.state;
    Object.keys(data[i]).forEach((item) => {
      if (data[i][item] && typeof data[i][item].editable !== 'undefined') {
        data[i][item].editable = false;
        data[i][item].status = type;
      }
    });
    this.setState({ data }, () => {
      Object.keys(data[i]).forEach((item) => {
        if (data[i][item] && typeof data[i][item].editable !== 'undefined') {
          delete data[i][item].status;
        }
      });
    });
  }
  edit(i) {
    const { data } = this.state;
    Object.keys(data[i]).forEach((item) => {
      if (data[i][item] && typeof data[i][item].editable !== 'undefined') {
        data[i][item].editable = true;
      }
    });
    this.setState({ data });
  }
  clearFilters = () => {
    this.setState({ filteredInfo: null });
  }
  delete = async (index) => {
    const { id } = this.state.data[index];
    const result = await this.props.deleteUser({ id: id.value });
    const { data: {deleteUser: { ok, res } } } = result;
    if (ok) {
      notification.open({
        duration: 3,
        placement: 'topRight',
        message: `${res}`,
      });
    } else {
      notification.open({
        duration: 3,
        placement: 'topRight',
        message: `${res}`,
      });
    }
  }
  handleCellChange(key, index, value) {
    const { data } = this.state;
    data[index][key].value = value;
    this.setState({ data });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }
  handleCreate = (e) => {
    e.preventDefault();
    const { form } = this;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      this.setState({ confirmLoading: true });
      form.resetFields();
      setTimeout(() => {
        this.setState({
          visible: false,
          confirmLoading: false,
        });
      }, 1000);
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  renderColumns(data, index, key, text) {
    const { editable, status, type } = data[index][key];
    if (typeof editable === 'undefined') {
      return text;
    }
    return (<TableCell
      editable={editable}
      type={type}
      value={text}
      onChange={value => this.handleCellChange(key, index, value)}
      status={status}
    />);
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    const { visible, confirmLoading } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
    }, {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      sorter: (a, b) => {
        if (a.name.charCodeAt(0) === b.name.charCodeAt(0)) {
          if (a.name.charCodeAt(1) === b.name.charCodeAt(1)) {
            return a.name.charCodeAt(2) - b.name.charCodeAt(2);
          }
          return a.name.charCodeAt(1) - b.name.charCodeAt(1);
        }
        return a.name.charCodeAt(0) - b.name.charCodeAt(0);
      },
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'name', text),
    }, {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: '20%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'phone', text),
    }, {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
      width: '20%',
      filters: [
        { text: 'Admins', value: 'Admin' },
        { text: 'Doctors', value: 'Doctor' },
        { text: 'Nurses', value: 'Nurse' },
        { text: 'Residents', value: 'Resident' },
        { text: 'Non-Medical Staff', value: 'Non-Medical' },
      ],
      filteredValue: filteredInfo.group || null,
      onFilter: (value, record) => record.group.includes(value),
      sorter: (a, b) => {
        if (a.group.charCodeAt(0) === b.group.charCodeAt(0)) {
          return a.group.charCodeAt(1) - b.group.charCodeAt(1);
        }
        return a.group.charCodeAt(0) - b.group.charCodeAt(0);
      },
      sortOrder: sortedInfo.columnKey === 'group' && sortedInfo.order,
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'group', text),
    }, {
      title: 'Actions',
      key: 'action',
      width: '15%',
      render: (text, record, index) => {
        const { editable } = this.state.data[index].name;
        return (
          <span>
            {editable ?
              <span>
                <button className="btn" onClick={() => this.editDone(index, 'save')}>Save</button>
                <span className="ant-divider" />
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(index, 'cancel')}>
                  <button className="btn">Cancel</button>
                </Popconfirm>
              </span>
              :
              <div>
                <span>
                  <button className="btn" onClick={() => this.edit(index)}>Edit</button>
                </span>
                <span className="ant-divider" />
                <Popconfirm title="Sure you wanna delete this?" onConfirm={() => this.delete(index)}>
                  <button className="btn">Delete</button>
                </Popconfirm>
              </div>
            }
          </span>
        );
      },
    }];
    return (
      <Row>
        <div className="users-table-operations">
          <Button icon="user-add" className="clear-filtersBtn" onClick={this.showModal}>Add User</Button>
          <Button className="clear-filtersBtn" onClick={this.clearFilters}>Clear filters</Button>
          <Button className="clear-filtersBtn" onClick={this.clearAll}>Clear filters and sorters</Button>
          <Button onClick={this.props.clearSearch}>Clear Search</Button>
        </div>
        <Form
          visible={visible}
          ref={this.saveFormRef}
          submit={this.handleCreate}
          onCreate={this.handleCreate}
          onCancel={this.handleCancel}
          confirmLoading={confirmLoading}
        />
        <Table
          bordered
          className="users-table"
          columns={columns}
          dataSource={this.props.dataSource}
          onChange={this.handleChange}
          pagination={{ pageSize: 25 }}
        />
      </Row>
    );
  }
}
TableClass.propTypes = {
  data: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  dataSource: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const deleteUserMtn = graphql(DELETE_USER_MUTATION, {
  props: ({ mutate }) => ({
    deleteUser: ({ id }) =>
      mutate({
        variables: { id },
      }),
  }),
});

export default compose(deleteUserMtn)(TableClass);
