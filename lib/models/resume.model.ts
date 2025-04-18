import { Schema, model, models } from "mongoose";

const ResumeSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ResumeSchema.index({ userId: 1 });

const Resume = models?.Resume || model("Resume", ResumeSchema);

export default Resume;
