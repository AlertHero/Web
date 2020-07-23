import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const { Search } = Input;
const SearchComponent = ({ value, onSearch, onInputChange }) => (
  <div className="users-title">
    <div className="users-search">
      <Search
        placeholder="Search Name"
        value={value}
        onSearch={onSearch}
        onChange={onInputChange}
      />
    </div>
  </div>
);
SearchComponent.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default SearchComponent;
