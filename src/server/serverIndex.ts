import Koa from "koa";
import bodyparser from "koa-bodyparser";
import cors from "koa2-cors";
import Router from "koa-router";
import { IO } from "../io/ioIndex";
import { latestBlocksRoom } from "../io/constant";

import { Config } from "../config/configIndex";
import Database from "../db/dbIndex";
import logger from "../logger/loggerIndex";
import fetch from "cross-fetch";
const API = {
  ContributeAdd: "/api/contribute/add",
  ContributeGet: "/api/contribute/get",
  ContributeGetLast: "/api/contribute/get/last",
  ContributeGetList: "/api/contribute/get/list",
  ContributeDelete: "/api/contribute/delete",
  rate: "/api/rate",
  pnsStatus: "/api/pns/status",
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
    router.get(API.pnsStatus, async (ctx) => {
      const { publickey } = ctx.query;
      let total = await this.db.contributeGetBalance(publickey);
      ctx.body = {
        code: "200",
        data: +total > 10 ? true : false,
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
    router.get(API.rate, async (ctx) => {
      const response = await fetch(
        `https://www.mexc.com/open/api/v2/market/ticker`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "access-control-allow-credentials": "true",
          },
        }
      );
      const data = await response.json();
      let rate = {};
      if (data.code === 200) {
        if (data.data.length) {
          rate = data.data.filter((v) => v.symbol === "CTO_USDT")[0];
        }
      }
      console.log(rate);
      ctx.body = {
        code: "200",
        data: rate,
      };
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
