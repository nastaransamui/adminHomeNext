import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const AboutSchema = new mongoose.Schema(
  {
    title_en: { type: String, required: true },
    title_fa: { type: String, required: true },
    desc_en: { type: String, required: true },
    desc_fa: { type: String, required: true },
    button_en: { type: String, required: true },
    button_fa: { type: String, required: true },
    firstThumb: { type: String, required: true },
    firstThumbKey: { type: String, required: true },
    firstTop: { type: Number, required: true },
    firstRight: { type: Number, required: true },
    secondThumb: { type: String, required: true },
    secondThumbKey: { type: String, required: true },
    secondTop: { type: Number, required: true },
    secondRight: { type: Number, required: true },
    thirdThumb: { type: String, required: true },
    thirdThumbKey: { type: String, required: true },
    thirdTop: { type: Number, required: true },
    thirdRight: { type: Number, required: true },
    finalFolder: { type: String, required: true },
    folderId: { type: String, required: true },
    isVercel: { type: Boolean, required: true },
  },
  { timestamps: true }
);

AboutSchema.plugin(timeZone, {
  path: ['createdAt', 'updatedAt'],
});
export default mongoose.models.About || mongoose.model('About', AboutSchema);
