import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row } from 'antd';

const Post = ({
  message: {
    id, text, createdAt, user: { firstName, lastName }, code: { color },
  },
}) => (
  <div>
    <Row>
      <div key={id} className={`message${(id < 0 ? 'optimistic' : '')}`}>
        <div className="post">
          <div className="message-code" style={{ backgroundColor: color }} />
          <div className="post-content">
            <h5 className="post-user">
              {firstName} {lastName}
              <span className="time">{moment(createdAt).format('LT')}</span>
            </h5>
            <p className="post-text">{text}</p>
          </div>
        </div>
      </div>
    </Row>
  </div>
);
Post.defaultProps = {
  message: {},
};
Post.propTypes = {
  message: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default Post;
