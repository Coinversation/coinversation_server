import mongoose from "mongoose";
import logger from "../logger/loggerIndex";

import { ContributeSchema } from "./models";

export default class Db {
  private contributeModel;
  constructor() {
    this.contributeModel = mongoose.model("Contribute", ContributeSchema);
  }
  static async create(uri = "mongodb://localhost:27017/otv"): Promise<Db> {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return new Promise((resolve, reject) => {
      mongoose.connection.once("open", async () => {
        const db = new Db();
        // if (!(await db.getLastNominatedEraIndex())) {
        //   await db.setLastNominatedEraIndex(0);
        // }
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
    return this.contributeModel
      .findOne({
        id: /[0-9]+/,
      })
      .exec();
  }
  async contributeAdd(publickey: string): Promise<any> {
    console.log(publickey);
    let data = await this.contributeModel
      .findOne({
        publickey: publickey,
      })
      .exec();

    return data;
  }
}
