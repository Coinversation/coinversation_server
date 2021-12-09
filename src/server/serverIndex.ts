import Koa from "koa";
import bodyparser from "koa-bodyparser";
import cors from "koa2-cors";
import Router from "koa-router";
import { IO } from "../io/ioIndex";
import { latestBlocksRoom } from "../io/constant";

import { Config } from "../config/configIndex";
import Database from "../db/dbIndex";
import logger from "../logger/loggerIndex";

const API = {
  ContributeAdd: "/api/contribute/add",
  ContributeGet: "/api/contribute/get",
  ContributeGetLast: "/api/contribute/get/last",
  ContributeGetList: "/api/contribute/get/list",
  ContributeDelete: "/api/contribute/delete",
};

export default class Server {
  public app: Koa;
  private db: Database;
  private port: number;
  private io;
  constructor(db: Database, config: Config) {
    this.app = new Koa();
    this.db = db;

    this.port = config.server.port;
    this.app.use(cors());
    this.app.use(bodyparser());

    const router = new Router();
    router.post(API.ContributeAdd, async (ctx) => {
      const { block, at, amount, publickey, sources, address } =
        ctx.request.body;
      const a = await this.db.contributeAdd(
        block,
        at,
        amount,
        publickey,
        sources,
        address
      );
      this.io.to(latestBlocksRoom).emit("latestBlocks", "simpleBlocks");
      ctx.body = {
        code: "200",
        data: a,
      };
    });
    router.get(API.ContributeGet, async (ctx) => {
      const a = await this.db.contributeGet();
      ctx.body = {
        code: "200",
        data: a,
      };
    });
    router.get(API.ContributeGetLast, async (ctx) => {
      const a = await this.db.contributeGetLast();
      ctx.body = {
        code: "200",
        data: a,
      };
    });
    router.get(API.ContributeGetList, async (ctx) => {
      const { publickey } = ctx.query;
      let total: number;
      if (publickey) {
        total = await this.db.contributeGetBalance(publickey);
      }
      const list = await this.db.contributeGetList();
      ctx.body = {
        code: "200",
        data: {
          ...list,
          total: total,
        },
      };
    });
    router.get(API.ContributeDelete, async (ctx) => {
      const { publickey } = ctx.query;
      console.log(publickey);
      if (publickey) {
        const data = await this.db.contributeAllRemove(publickey);
        ctx.body = {
          code: "200",
          data: data,
        };
      } else {
        ctx.body = {
          code: "401",
          msg: "publickey none",
        };
      }
    });

    this.app.use(router.routes());
  }
  start(): void {
    logger.info(`Now listening on ${this.port}`);
    const _io = require("socket.io")(this.app.listen(this.port), {
      cors: {
        origin: "*",
      },
    });
    this.io = IO(_io);
  }
}
