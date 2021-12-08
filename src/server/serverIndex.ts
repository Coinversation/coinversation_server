import Koa from "koa";
import bodyparser from "koa-bodyparser";
import cors from "koa2-cors";
import Router from "koa-router";

import { Config } from "../config/configIndex";
import Database from "../db/dbIndex";
import logger from "../logger/loggerIndex";

const API = {
  ContributeAdd: "/contribute/add",
  ContributeGet: "/contribute/get",
};

export default class Server {
  public app: Koa;
  private db: Database;
  private port: number;
  constructor(db: Database, config: Config) {
    this.app = new Koa();
    this.db = db;
    this.port = config.server.port;
    this.app.use(cors());
    this.app.use(bodyparser());

    const router = new Router();
    router.post(API.ContributeAdd, async (ctx) => {
      // const { time, address, amount, source, publickey } = ctx.request.body;
      // const a = await this.db.contributeAdd(time, amount, publickey);
      // ctx.body = a;
    });
    router.get(API.ContributeGet, async (ctx) => {
      const { publickey } = ctx.query;
      const a = await this.db.contributeAdd(publickey);
      ctx.body = a;
    });
    this.app.use(router.routes());
  }
  start(): void {
    logger.info(`Now listening on ${this.port}`);
    this.app.listen(this.port);
  }
}
