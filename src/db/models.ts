import { Schema } from "mongoose";

export const ContributeSchema = new Schema({
  id: Schema.Types.ObjectId,
  at: String,
  amount: String,
  publickey: String,
  block: String,
  sources: String,
  address: String,
});
