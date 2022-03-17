import React from "react";

import { useAppDispatch } from "../store/hooks";
import { fetchCurrencies } from "../store/slices/currenciesSlice";

export default function FetchFailedAlert() {
  const dispatch = useAppDispatch();

  return (
    <div className="row justify-content-center">
      <div className="alert alert-danger mt-3 col-11 col-md-6" role="alert">
        <span>Ошибка при загрузке данных!</span>{" "}
        <span
          role="button"
          className="fw-bold"
          onClick={() => dispatch(fetchCurrencies())}
        >
          Перезагрузить
        </span>
      </div>
    </div>
  );
}
