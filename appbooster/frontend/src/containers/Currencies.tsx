import React, { useEffect } from "react";

import {
  fetchCurrencies,
  setBaseCurrency,
} from "../store/slices/currenciesSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import BaseCurrencySelector from "../components/BaseCurrencySelector";
import FetchFailedAlert from "../components/FetchFailedAlert";
import CurrenciesTable from "../components/CurrenciesTable";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { Status } from "../utils/enums";
import { DEFAULT_CURRENCY } from "../utils/consts";

function Currencies() {
  const dispatch = useAppDispatch();

  const { currenciesList, baseCurrency, status, timestamp } = useAppSelector(
    ({ currencies }) => ({
      ...currencies,
      timestamp: currencies.timestamp
        ? new Date(currencies.timestamp).toLocaleString()
        : "",
      baseCurrency:
        currencies.currenciesMap[
          currencies.baseCurrency ?? DEFAULT_CURRENCY.charCode
        ],
    })
  );

  useEffect(() => {
    if (status === Status.IDLE || status === Status.FAILED) {
      dispatch(fetchCurrencies());
    }
  });

  return (
    <PageContainer>
      <PageHeader title="Курсы валют"></PageHeader>
      {(status === Status.IDLE || status === Status.FETCHING) && <Spinner />}
      {status === Status.SUCCESS && (
        <div className="d-flex flex-column align-items-center">
          <span className="text-secondary d-inline-block mb-3">
            {timestamp}
          </span>
          <BaseCurrencySelector
            currencies={currenciesList}
            baseCurrency={baseCurrency}
            onSelect={(currency) => dispatch(setBaseCurrency(currency))}
          />
          <CurrenciesTable
            currencies={currenciesList}
            baseCurrency={baseCurrency}
          />
        </div>
      )}
      {status === Status.FAILED && <FetchFailedAlert />}
    </PageContainer>
  );
}

export default Currencies;
