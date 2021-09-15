import React from 'react';
import PropTypes from 'prop-types';

function Notification({ message, className }) {
  if(message === null) {
    return null;
  }

  return (
    <div className='notification'>
      <div className={className}>
        {message}
      </div>
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default Notification;