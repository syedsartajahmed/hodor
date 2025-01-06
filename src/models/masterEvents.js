import { Schema, model, models } from "mongoose";

const MasterEventSchema = new Schema({
  eventName: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  event_definition: { type: String, required: true },
  stakeholders: { type: String, required: true },
  stakeholders: [{ type: String, required: true }],
  category: { type: String, required: true },
  source: [{ type: String, required: true }],
  action: { type: String, required: true },
  platform: [{ type: String, required: true }],
  identify: { type: Boolean, default: false },
  unidentify: { type: Boolean, default: false },
  organization: { type: String },
});

const MasterEvent =
  models.MasterEvent || model("MasterEvent", MasterEventSchema);
export default MasterEvent;
export const schema = MasterEventSchema;
