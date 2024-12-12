import { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
  property: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
});

const Item = models.Item || model('Item', ItemSchema);
export default Item;
export const schema = ItemSchema;
