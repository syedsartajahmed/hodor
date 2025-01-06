import { Schema, model, models } from "mongoose";

const OrganizationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],
  createdAt: { type: Date, default: Date.now },
});

const Organization =
  models.Organization || model("Organization", OrganizationSchema);
export default Organization;
