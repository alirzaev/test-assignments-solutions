import React from "react";

import { Currency } from "../store/slices/currenciesSlice";

export interface CurrenciesTableProps {
  currencies: Currency[];
  baseCurrency: Currency;
}

export default function CurrenciesTable(props: CurrenciesTableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Код</th>
          <th scope="col">Название</th>
          <th scope="col">Курс</th>
        </tr>
      </thead>
      <tbody>
        {props.currencies.map(({ charCode, name, value }) => (
          <tr key={charCode}>
            <td>{charCode}</td>
            <td>{name}</td>
            <td>{(value / props.baseCurrency.value).toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
