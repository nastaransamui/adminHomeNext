import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const PhotosSchema = new mongoose.Schema(
  {
    title_en: { type: String, required: true },
    title_fa: { type: String, required: true },
    topTitle_en: { type: String, required: true },
    topTitle_fa: { type: String, required: true },
    subTitle_en: { type: String, required: true },
    subTitle_fa: { type: String, required: true },
    button_en: { type: String, required: true },
    button_fa: { type: String, required: true },
    finalFolder: { type: String, required: true },
    folderId: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    isVercel: { type: Boolean, required: true },
    imageShow: { type: String, required: true },
    imageShowKey: { type: String, required: true },
  },
  { timestamps: true }
);

PhotosSchema.plugin(timeZone, {
  path: ['createdAt', 'updatedAt'],
});
export default mongoose.models.Photos || mongoose.model('Photos', PhotosSchema);
