import { Schema, model, models } from "mongoose";

const ItemSchema = new Schema({
  user_property: [
    {
      name: { type: String },
      value: { type: Schema.Types.Mixed },
      data_type: { type: String, default: "" },
      property_definition: { type: String, default: "" },
    },
  ],

  event_property: [
    {
      property_type: { type: String },
      property_name: { type: String },
      property_definition: { type: String },
      data_type: { type: String },
      sample_value: { type: Schema.Types.Mixed },
      method_call: { type: Schema.Types.Mixed },
    },
  ],

  super_property: [
    {
      name: { type: String },
      value: { type: Schema.Types.Mixed },
      data_type: { type: String, default: "" },
      property_definition: { type: String, default: "" },
    },
  ],
});

const Item = models.Item || model("Item", ItemSchema);
export default Item;
export const schema = ItemSchema;
