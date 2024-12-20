import { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
  property_type: { type: String, required: true },
  property_name: { type: String, required: true },
  property_definition: { type: String, },
  data_type: { type: String, required: true },
  sample_value: { type: Schema.Types.Mixed, },
  method_call: { type: Schema.Types.Mixed, },
});

const Item = models.Item || model('Item', ItemSchema);
export default Item;
export const schema = ItemSchema;
