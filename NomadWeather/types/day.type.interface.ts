import Weather from "./weather.type.interface";
export default interface Day {
    temp: {
      day: string;
    };
    weather: Weather[];
  }