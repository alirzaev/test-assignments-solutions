import axios from "axios";

const API_URL = "https://www.cbr-xml-daily.ru/daily_json.js";

export interface DailyCurrencies {
  Valute: {
    [s: string]: {
      CharCode: string;
      Nominal: number;
      Name: string;
      Value: number;
    };
  };
  Timestamp: string;
}

export async function getDailyCurrencies(): Promise<DailyCurrencies> {
  const response = await axios.get<DailyCurrencies>(API_URL);

  return response.data;
}
