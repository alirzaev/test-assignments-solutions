import React from "react";
import { DateTime, Duration } from "luxon";

import { Ticket, TicketSegment } from "../../utils/types";

import "./index.css";

interface TicketCardSegmentProps {
  segment: TicketSegment;
}

function TicketCardSegment(props: TicketCardSegmentProps) {
  const { date, duration, origin, destination, stops } = props.segment;

  const departure = DateTime.fromISO(date);
  const arrival = DateTime.fromISO(date).plus({ minute: duration });

  const formattedArrival = arrival.toLocaleString(DateTime.TIME_24_SIMPLE);
  const formattedDeparture = departure.toLocaleString(DateTime.TIME_24_SIMPLE);

  const normalizedDuration = Duration.fromObject({
    hours: 0,
    minutes: duration,
  })
    .normalize()
    .toObject();

  return (
    <div className="row justify-content-center mb-3">
      <div className="col-4">
        <span className="d-block text-uppercase text-secondary">
          {origin} - {destination}
        </span>
        <span className="d-block text-uppercase fw-bold">
          {`${formattedDeparture} - ${formattedArrival}`}
        </span>
      </div>
      <div className="col-4">
        <span className="d-block text-uppercase text-secondary">В пути</span>
        <span className="d-block fw-bold">
          {`${normalizedDuration.hours}ч ${normalizedDuration.minutes}м`}
        </span>
      </div>
      <div className="col-4">
        <span className="d-block text-uppercase text-secondary">
          {stops.length === 0
            ? "Без пересадок"
            : stops.length === 1
            ? "1 пересадка"
            : `${stops.length} пересадки`}
        </span>
        <span className="d-block fw-bold">
          {stops.length > 0
            ? stops
                .map((stop) => stop.toString())
                .reduce((prev, curr) => `${prev}, ${curr}`)
            : ""}
        </span>
      </div>
    </div>
  );
}

interface TicketCardHeaderProps {
  price: number;
  carrier: string;
}

function TicketCardHeader(props: TicketCardHeaderProps) {
  return (
    <div className="row justify-content-center align-content-center mb-3">
      <div className="col d-flex align-items-center">
        <span className="fs-3 text-primary">{props.price} Р</span>
      </div>
      <img
        className="col-3 ticket-card-header-career"
        src={`https://pics.avs.io/99/36/${props.carrier}.png`}
        alt={props.carrier}
      />
    </div>
  );
}

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard(props: TicketCardProps) {
  const { price, carrier, segments } = props.ticket;

  return (
    <div className="ticket-card shadow">
      <TicketCardHeader price={price} carrier={carrier} />
      <TicketCardSegment segment={segments[0]} />
      <TicketCardSegment segment={segments[1]} />
    </div>
  );
}
