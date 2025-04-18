import { Schema, model, models } from "mongoose";

const ResponseSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  data: {
    type: Object,
    required: true,
  },
  resume: {
    type: Object,
    required: true,
  },
});

ResponseSchema.index({ userId: 1, date: -1 });

const Response = models?.Response || model("Response", ResponseSchema);

export default Response;
