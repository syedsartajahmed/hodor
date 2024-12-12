import { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
  eventName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }], 
  additionalInfo: { type: Schema.Types.Mixed },
});

const Event = models.Event || model('Event', EventSchema);
export default Event;
export const schema = EventSchema;
