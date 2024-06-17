import React from 'react';
import loading from './loading.gif';

const Spinner = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '9999',
      }}
    >
      <img src={loading} alt="loading" />
    </div>
  );
};

export default Spinner;
