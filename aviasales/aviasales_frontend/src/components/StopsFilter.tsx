import React from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setStopsCount } from "../store/slices/filtersSlice";
import { StopType } from "../utils/types";

interface StopCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function StopCheckbox(props: StopCheckboxProps) {
  return (
    <div className="form-check mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        id={props.id}
        onChange={({ target }) => props.onChange(target.checked)}
        checked={props.checked}
      />
      <label className="form-check-label" htmlFor={props.id}>
        {props.label}
      </label>
    </div>
  );
}

export default function StopsFilter() {
  const { stops, all } = useAppSelector((state) => ({
    stops: new Set<StopType>(state.filters.stops),
    all: state.filters.stops.length === 4,
  }));
  const dispatch = useAppDispatch();

  const updateStops = (stop: StopType, checked: boolean) => {
    const newStops = new Set<StopType>(stops.values());

    if (checked) {
      newStops.add(stop);
    } else {
      newStops.delete(stop);
    }

    dispatch(setStopsCount(newStops));
  };

  const toggleAllStops = (checked: boolean) => {
    dispatch(
      setStopsCount(checked ? new Set<StopType>([0, 1, 2, 3]) : new Set())
    );
  };

  return (
    <form>
      <fieldset>
        <legend className="text-uppercase">Количество пересадок</legend>

        <StopCheckbox
          id="all"
          label="Все"
          checked={all}
          onChange={(checked) => toggleAllStops(checked)}
        />

        <StopCheckbox
          id="zero"
          label="Без пересадок"
          checked={stops.has(0)}
          onChange={(checked) => updateStops(0, checked)}
        />
        <StopCheckbox
          id="one"
          label="1 пересадка"
          checked={stops.has(1)}
          onChange={(checked) => updateStops(1, checked)}
        />
        <StopCheckbox
          id="two"
          label="2 пересадкик"
          checked={stops.has(2)}
          onChange={(checked) => updateStops(2, checked)}
        />
        <StopCheckbox
          id="three"
          label="3 пересадки"
          checked={stops.has(3)}
          onChange={(checked) => updateStops(3, checked)}
        />
      </fieldset>
    </form>
  );
}
