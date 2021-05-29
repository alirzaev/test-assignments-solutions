import React from 'react';
import {useDispatch} from 'react-redux';

import {fetchCurrencies} from '../actions/CurrenciesActions';

function FetchFailedAlert() {
  const dispatch = useDispatch();

  return (
    <div className='row justify-content-center'>
      <div className='alert alert-danger mt-3 col-11 col-md-6' role='alert'>
                Ошибка при загрузке данных! <span role="button" className='fw-bold'
          onClick={() => dispatch(fetchCurrencies())}>Перезагрузить</span>
      </div>
    </div>
  );
}

export default FetchFailedAlert;
