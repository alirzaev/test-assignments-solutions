import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCurrencies } from "../store/slices/currenciesSlice";
import { setInputField } from "../store/slices/converterSlice";
import FetchFailedAlert from "../components/FetchFailedAlert";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { Status } from "../utils/enums";

function Converter() {
  const dispatch = useAppDispatch();

  const { status, input, output } = useAppSelector(
    ({ converter, currencies }) => ({
      ...converter,
      status: currencies.status,
    })
  );

  useEffect(() => {
    if (status === Status.IDLE || status === Status.FAILED) {
      dispatch(fetchCurrencies());
    }
  });

  return (
    <PageContainer>
      <PageHeader title="Конвертер"></PageHeader>
      {(status === Status.IDLE || status === Status.FETCHING) && <Spinner />}
      {status === Status.SUCCESS && (
        <div className="mt-3 mb-3 d-flex flex-column align-items-center">
          <div className="col-12 col-sm-auto">
            <input
              type="text"
              className="form-control col-auto"
              value={input}
              onChange={({ target }) => dispatch(setInputField(target.value))}
              placeholder="15 usd in rub"
            />
          </div>
          {output && (
            <span className="col-auto align-self-center pt-2 pb-2">
              {output.value.toFixed(4)} {output.currency}
            </span>
          )}
        </div>
      )}
      {status === Status.FAILED && <FetchFailedAlert />}
    </PageContainer>
  );
}

export default Converter;
