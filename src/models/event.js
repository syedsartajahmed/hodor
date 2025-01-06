import { Schema, model, models } from "mongoose";

const EventSchema = new Schema({
  eventName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
  event_definition: { type: String, required: true },
  stakeholders: [{ type: String, required: true }],
  category: { type: String, required: true },
  source: [{ type: String, required: true }],
  action: { type: String, required: true },
  platform: [{ type: String, required: true }],
  identify: { type: Boolean, default: false },
  unidentify: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["completed", "not started", "in progress"],
    default: "not started",
  },
});

const Event = models.Event || model("Event", EventSchema);
export default Event;
export const schema = EventSchema;
