import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTickets } from "../store/slices/ticketsSlice";
import { filter } from "../utils/funcs";
import StopsFilter from "../components/StopsFilter";
import SortFilter from "../components/SortFilter";
import TicketCard from "../components/TicketCard";

function TicketsList() {
  const { tickets, stops, order } = useAppSelector(({ tickets, filters }) => ({
    tickets: filter(tickets.tickets, filters.stops, filters.order),
    stops: filters.stops,
    order: filters.order,
  }));

  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(Math.min(tickets.length, 5));
  }, [stops, order, tickets.length]);

  const showMoreTickets = () => {
    setShown(Math.min(shown + 5, tickets.length));
  };

  return (
    <React.Fragment>
      <div className="mt-3 mb-3">
        <h2 className="d-none">Билеты</h2>
        {tickets.slice(0, shown).map((ticket, index) => (
          <TicketCard ticket={ticket} key={index} />
        ))}
      </div>
      {shown <= tickets.length && (
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary m-auto"
            onClick={showMoreTickets}
          >
            Показать еще 5 билетов
          </button>
        </div>
      )}
    </React.Fragment>
  );
}

function Spinner() {
  return (
    <div className="mt-3 mb-3 row justify-content-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>
  );
}

export default function App() {
  const { isFetching } = useAppSelector((state) => state.tickets);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  return (
    <div className="container">
      <header className="header">
        <h1 className="text-center pt-2 pb-2">Aviasales</h1>
      </header>
      <main>
        <div className="row justify-content-center">
          <div className="col-md-3 col-sm-12">
            <StopsFilter />
          </div>
          <div className="col-md-9 col-sm-12 mb-3">
            <SortFilter />
            {isFetching ? <Spinner /> : <TicketsList />}
          </div>
        </div>
      </main>
    </div>
  );
}
