import { SortOrder } from "./enums";
import { StopType, Ticket } from "./types";

export function filter(
  tickets: Ticket[],
  stops: StopType[],
  order: SortOrder
): Ticket[] {
  const set = new Set<number>(stops);

  return tickets
    .filter(
      ({ segments }) =>
        set.size === 0 ||
        (set.has(segments[0].stops.length) && set.has(segments[1].stops.length))
    )
    .sort((a, b) => {
      if (order === SortOrder.CHEAPEST) {
        return a.price - b.price;
      }

      return (
        a.segments[0].duration +
        a.segments[1].duration -
        (b.segments[0].duration + b.segments[1].duration)
      );
    });
}
