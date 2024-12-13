import { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
  eventName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }], 
  additionalInfo: { type: Schema.Types.Mixed },
  stakeholders: { type: String, required: true },
  category: { type: String, required: true },
  propertyBundles: { type: String, required: true },
  groupProperty: { type: String, required: true },
  source: { type: String, required: true },
  action: { type: String, required: true },
});

const Event = models.Event || model('Event', EventSchema);
export default Event;
export const schema = EventSchema;
