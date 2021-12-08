import mongoose from "mongoose";
import logger from "../logger/loggerIndex";

import { ContributeSchema } from "./models";

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
    let data = await this.contributeModel
      .find()
      // .sort({ block: -1 })
      // .limit(1)
      .exec();
    return data[data.length - 1];
  }
  async contributeGet(publickey: string): Promise<any> {
    let data = await this.contributeModel.find().exec();
    return data;
  }
  async contributeAdd(
    block: string,
    at: string,
    amount: string,
    publickey: string,
    sources: string // bifrost, parallel, coinversation, polkadotOfficial
  ): Promise<any> {
    let data = await this.contributeModel.create({
      block: block,
      at: at,
      amount: amount,
      publickey: publickey,
      sources: sources,
    });
    console.log(data);
    return data;
  }
}
