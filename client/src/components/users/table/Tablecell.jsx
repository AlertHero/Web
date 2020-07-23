import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';

const { Option } = Select;
class Tablecell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      value: props.value,
      editable: props.editable || false,
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }
  componentWillReceiveProps({ editable, status }) {
    if (editable !== this.state.editable) {
      this.setState({ editable });
      if (editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (status && status !== this.props.status) {
      if (status === 'save') {
        this.props.onChange(this.state.value);
      } else if (status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable || nextState.value !== this.state.value;
  }
  handleChange = ({ target: { value } }) => {
    this.setState({ value });
  }
  handleSelectChange(value) {
    this.setState({ value });
  }
  render() {
    const { value, editable, type } = this.state;
    let cell = null;
    switch (type) {
      case 'select-title': if (editable) {
        cell = (
          <div>
            <Select defaultValue={value} onChange={this.handleSelectChange}>
              <Option value="Dr.">Dr.</Option>
              <Option value="Mr.">Mr.</Option>
              <Option value="Mrs.">Mrs.</Option>
              <Option value="Ms.">Ms.</Option>
            </Select>
          </div>);
      } else {
        cell = (
          <div className="editable-row-text">
            {value.toString() || ' '}
          </div>);
      } break;
      case 'select-group': if (editable) {
        cell = (
          <div>
            <Select defaultValue={value} onChange={this.handleSelectChange}>
              <Option value="Doctor">Doctor</Option>
              <Option value="Resident">Resident</Option>
              <Option value="Nurse">Nurse</Option>
              <Option value="Non-Medical Staff">Non-Medical Staff</Option>
            </Select>
          </div>);
      } else {
        cell = (
          <div className="editable-row-text">
            {value.toString() || ' '}
          </div>);
      } break;
      default: if (editable) {
        cell = (
          <div>
            <Input value={value} onChange={e => this.handleChange(e)} />
          </div>);
      } else {
        cell = (
          <div className="editable-row-text">
            {value.toString() || ' '}
          </div>);
      }
    }
    return (
      <div className="editable-cell">
        {cell}
      </div>
    );
  }
}
Tablecell.defaultProps = {
  type: '',
};
Tablecell.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
};

export default Tablecell;
