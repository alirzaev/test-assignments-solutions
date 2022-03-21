export type StopType = 0 | 1 | 2 | 3;

export interface TicketSegment {
  date: string;
  duration: number;
  origin: string;
  destination: string;
  stops: StopType[];
}

export interface Ticket {
  price: number;
  carrier: string;
  segments: TicketSegment[];
}
