import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import FetchFailedAlert from '../components/FetchFailedAlert';
import Spinner from '../components/Spinner';
import {fetchCurrencies, setBaseCurrency} from '../actions/CurrenciesActions';
import Status from '../enum/Status';

function Currencies() {
  const dispatch = useDispatch();

  const {currencies, baseCurrency, status, timestamp} = useSelector((({currencies}) => ({
    ...currencies,
    timestamp: new Date(currencies.timestamp).toLocaleString(),
    baseCurrency: currencies.currencies.get(currencies.baseCurrency ?? 'RUB')
  })));

  useEffect(() => {
    if (status === Status.IDLE || status === Status.FAILED) {
      dispatch(fetchCurrencies());
    }
  }, []);

  return (
    <div className='row justify-content-center'>
      <div className='col-12 col-md-9'>
        <h2>Курсы валют</h2>
        {(status === Status.IDLE || status === Status.FETCHING) && (
          <Spinner/>
        )}
        {status === Status.SUCCESS && (
          <React.Fragment>
            <span className='text-secondary d-inline-block mb-3'>{timestamp}</span>
            <div className='row mb-3'>
              <label className='col-auto col-form-label'
                htmlFor='baseCurrency'>Базовая валюта:</label>
              <div className='col-auto align-self-center'>
                <select className="form-select col" id='baseCurrency'
                  value={baseCurrency.charCode}
                  onChange={(event) => dispatch(setBaseCurrency(event.target.value))}
                >
                  {currencies.valueSeq().map(({charCode, name}) => (
                    <option value={charCode} key={charCode}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Код</th>
                  <th scope="col">Название</th>
                  <th scope="col">Курс</th>
                </tr>
              </thead>
              <tbody>
                {currencies.valueSeq().map(({charCode, name, value}) => (
                  <tr key={charCode}>
                    <td>{charCode}</td>
                    <td>{name}</td>
                    <td>{(value / baseCurrency.value).toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </React.Fragment>
        )}
        {status === Status.FAILED && (
          <FetchFailedAlert/>
        )}
      </div>
    </div>
  );
}

export default Currencies;
