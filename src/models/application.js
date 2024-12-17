import { Schema, model, models } from 'mongoose';

const ApplicationSchema = new Schema({
  type: { 
    type: String, 
    enum: ['web', 'chrome', 'app', 'backend'], 
    required: true 
  },
  events: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Event' 
  }],
  projectId: { 
    type: String, 
    //required: true 
  },
  token: { 
    type: String, 
    //required: true 
  },
  serviceAccountPassword: { 
    type: String, 
    //required: true 
  },
  apiSecret: { 
    type: String, 
    //required: true 
  },
});

const Application = models.Application || model('Application', ApplicationSchema);
export default Application;
export const schema = ApplicationSchema;
