import React from 'react';
import PropTypes from 'prop-types';

function Notification({ message, className }) {
  if(message === null) {
    return null;
  }

  return (
    <div className={className}>
      {message}
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default Notification;