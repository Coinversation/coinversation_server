import mongoose from "mongoose";
import logger from "../logger/loggerIndex";

import { ContributeSchema } from "./models";
import { unique } from "../utils/utils";
export default class Db {
  private contributeModel;
  constructor() {
    this.contributeModel = mongoose.model("contribute", ContributeSchema);
  }
  static async create(
    uri = "mongodb://localhost:27017/contribute"
  ): Promise<Db> {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
      mongoose.connection.once("open", async () => {
        const db = new Db();
        if (!(await db.getLastNominatedEraIndex())) {
          await db.setLastNominatedEraIndex(0);
        }
        resolve(db);
      });
      mongoose.connection.on("error", (err) => {
        logger.error(`MonogoDB connection issue: ${err}`);
        reject(err);
      });
    });
  }
  async setLastNominatedEraIndex(index: number): Promise<boolean> {
    const data = await this.contributeModel.findOne({
      id: /.*/,
    });
    if (!data) {
      const eraIndex = new this.contributeModel({
        id: index,
      });
      return eraIndex.save();
    }
    return this.contributeModel.findOneAndUpdata(
      {
        id: /.*/,
      },
      {
        $set: {
          id: index,
        },
      }
    );
  }
  async getLastNominatedEraIndex(): Promise<any> {
    return this.contributeModel.find().exec();
  }

  async contributeGetLast(): Promise<any> {
    let data = await this.contributeModel.find().exec();
    return data[data.length - 1];
  }

  async contributeGetBalance(publickey: string): Promise<any> {
    let data = await this.contributeModel
      .find({
        publickey: publickey,
      })
      .exec();
    let total = 0;
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        total += +data[i].amount;
      }
    }
    return total;
  }
  async contributeListOfWinners(): Promise<any> {
    let data = await this.contributeModel.find().exec();
    return data.length > 1 ? [data[data.length - 1]] : data;
  }
  async contributeGetList(): Promise<any> {
    let data = await this.contributeModel.find().exec();

    let alltotal = 0;
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        alltotal += +data[i].amount;
      }
    }
    return {
      list:
        data.length > 2 ? [data[data.length - 2], data[data.length - 1]] : data,
      alltotal: alltotal,
      count: unique(data, "publickey").length,
    };
  }

  async contributeAllRemove(publickey: string): Promise<any> {
    let data = await this.contributeModel
      .findOneAndDelete({ amount: publickey })
      .exec();
    return data;
  }

  async contributeGet(): Promise<any> {
    let data = await this.contributeModel.find().exec();
    return data;
  }
  async contributeAdd(
    block: string,
    at: string,
    amount: string,
    publickey: string,
    sources: string, // bifrost, parallel, coinversation, polkadotOfficial
    address: string,
    hash: string
  ): Promise<any> {
    let data = await this.contributeModel.create({
      block: block,
      at: at,
      amount: amount,
      publickey: publickey,
      sources: sources,
      address: address,
      hash: hash,
    });
    return data;
  }
}
