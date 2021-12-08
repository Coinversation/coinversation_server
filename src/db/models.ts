import { Schema } from "mongoose"

export const ContributeSchema = new Schema({
  id: Number,
  timeAt: {type:Number, default: 0},
  address: String,
  amount: String,
  source: String,
  publickey: String
})