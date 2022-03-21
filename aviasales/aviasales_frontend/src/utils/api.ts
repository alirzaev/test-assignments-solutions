import axios from "axios";

import { Ticket } from "./types";

const API_URL = "https://front-test.beta.aviasales.ru";

interface SearchIdResponse {
  searchId: string;
}

interface TicketsChunkReponse {
  stop: boolean;
  tickets: Ticket[];
}

export async function getTickets(): Promise<Ticket[]> {
  const { searchId } = (await axios.get<SearchIdResponse>(`${API_URL}/search`))
    .data;
  const tickets: Ticket[] = [];

  for (;;) {
    try {
      const { tickets: chunk, stop } = (
        await axios.get<TicketsChunkReponse>(`${API_URL}/tickets`, {
          params: {
            searchId,
          },
        })
      ).data;

      tickets.push(...chunk);

      if (stop) {
        break;
      }
    } catch (e) {
      console.log(e);
    }
  }

  return tickets;
}
