import { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
  name: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  additionalInfo: { type: Schema.Types.Mixed },
});

const Item = models.Item || model('Item', ItemSchema);
export default Item;
export const schema = ItemSchema;
