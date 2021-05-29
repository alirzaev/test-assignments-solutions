import React from 'react';

function Spinner() {
  return (
    <div className='row justify-content-center'>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>
  );
}

export default Spinner;
