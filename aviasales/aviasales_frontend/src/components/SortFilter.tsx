import React from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSortOrder } from "../store/slices/filtersSlice";
import { SortOrder } from "../utils/enums";

export default function SortFilter() {
  const { order } = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  return (
    <div className="w-100 btn-group">
      <input
        type="radio"
        className="btn-check"
        name="order"
        id="cheapest"
        autoComplete="off"
        onChange={({ target }) =>
          dispatch(setSortOrder(target.value as SortOrder))
        }
        value={SortOrder.CHEAPEST}
        checked={order === SortOrder.CHEAPEST}
      />
      <label className="btn btn-outline-primary" htmlFor="cheapest">
        Самый дешевый
      </label>

      <input
        type="radio"
        className="btn-check"
        name="order"
        id="fastest"
        autoComplete="off"
        onChange={({ target }) =>
          dispatch(setSortOrder(target.value as SortOrder))
        }
        value={SortOrder.FASTEST}
        checked={order === SortOrder.FASTEST}
      />
      <label className="btn btn-outline-primary" htmlFor="fastest">
        Самый быстрый
      </label>
    </div>
  );
}
