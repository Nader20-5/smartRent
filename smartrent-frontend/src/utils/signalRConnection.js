import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { SIGNALR_URL } from "./constants";

export const createSignalRConnection = (token) => {
  const connection = new HubConnectionBuilder()
    .withUrl(SIGNALR_URL, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
};
