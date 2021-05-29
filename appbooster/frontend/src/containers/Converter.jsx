import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import FetchFailedAlert from '../components/FetchFailedAlert';
import Spinner from '../components/Spinner';
import {fetchCurrencies} from '../actions/CurrenciesActions';
import {setInputField} from '../actions/ConverterActions';
import Status from '../enum/Status';

function Converter() {
  const dispatch = useDispatch();

  const {status, currency, input, value} = useSelector(({converter, currencies}) => ({
    ...converter,
    status: currencies.status
  }));

  useEffect(() => {
    if (status === Status.IDLE || status === Status.FAILED) {
      dispatch(fetchCurrencies());
    }
  }, []);

  return (
    <div className='row justify-content-center'>
      <div className='col-12 col-md-9'>
        <h2>Конвертер</h2>
        {(status === Status.IDLE || status === Status.FETCHING) && (
          <Spinner/>
        )}
        {status === Status.SUCCESS && (
          <div className='mt-3 mb-3 row'>
            <div className='col-12 col-sm-auto'>
              <input type='text' className='form-control col-auto'
                value={input}
                onChange={(event) => dispatch(setInputField(event.target.value))}
                placeholder='15 usd in rub'/>
            </div>
            {currency && (
              <span className='col-auto align-self-center pt-2 pb-2'>
                {value.toFixed(4)} {currency}
              </span>
            )}
          </div>
        )}
        {status === Status.FAILED && (
          <FetchFailedAlert/>
        )}
      </div>
    </div>
  );
}

export default Converter;
