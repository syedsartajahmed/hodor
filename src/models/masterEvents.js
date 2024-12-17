import { Schema, model, models } from 'mongoose';

const MasterEventSchema = new Schema({
  eventName: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }], 
  additionalInfo: { type: Schema.Types.Mixed },
  stakeholders: { type: String, required: true },
  category: { type: String, required: true },
  propertyBundles: { type: String, required: true },
  groupProperty: { type: String, required: true },
  source: { type: String, required: true },
  action: { type: String, required: true },
});

const MasterEvent = models.MasterEvent || model('MasterEvent', MasterEventSchema);
export default MasterEvent;
export const schema = MasterEventSchema;
