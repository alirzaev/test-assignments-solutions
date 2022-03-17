import React from "react";

import { Currency } from "../store/slices/currenciesSlice";

export interface BaseCurrencySelectorProps {
  currencies: Currency[];
  baseCurrency: Currency;
  onSelect: (currencyCode: string) => void;
}

export default function BaseCurrencySelector(props: BaseCurrencySelectorProps) {
  return (
    <div className="row mb-3">
      <label className="col-auto col-form-label" htmlFor="baseCurrency">
        Базовая валюта:
      </label>
      <div className="col-auto align-self-center">
        <select
          className="form-select col"
          id="baseCurrency"
          value={props.baseCurrency.charCode}
          onChange={({ target }) => props.onSelect(target.value)}
        >
          {props.currencies.map(({ charCode, name }) => (
            <option value={charCode} key={charCode}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
