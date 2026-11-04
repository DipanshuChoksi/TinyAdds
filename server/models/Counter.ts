import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const counterSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export type CounterSchemaType = InferSchemaType<typeof counterSchema>;
export type CounterDocument = HydratedDocument<CounterSchemaType>;

export const Counter = model("Counter", counterSchema);

export async function getNextSequence(sequenceName: string): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
