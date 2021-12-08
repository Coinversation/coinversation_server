import WS from "ws";
import ReconnectingWebSocket from "reconnecting-websocket";
import { Config } from "../config/configIndex";
import Database from "../db/dbIndex";
export default class TelemetryClient {
  private config: Config;
  private db: Database;
  private host: string;
  private socket: ReconnectingWebSocket;
  private beingReported: Map<string, boolean> = new Map();

  constructor(config: Config, db: Database) {
    this.config = config;
    this.db = db;
    this.host = this.config.telemetry.host;
    const options = {
      WebSocket: WS,
      connectionTimeout: 1000,
      maxRetries: 10,
    };
  }
}
