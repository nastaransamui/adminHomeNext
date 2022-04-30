import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const FeaturesSchema = new mongoose.Schema(
  {
    title_en: { type: String, required: true },
    title_fa: { type: String, required: true },
    featureThumb: { type: String, required: true },
    featureThumbKey: { type: String, required: true },
    featureLink: { type: String, required: true },
    featureLinkKey: { type: String, required: true },
    youTubeId: { type: String },
    finalFolder: { type: String, required: true },
    folderId: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    isYoutube: { type: Boolean, required: true },
    isVercel: { type: Boolean, required: true },
  },
  { timestamps: true }
);

FeaturesSchema.plugin(timeZone, {
  path: ['createdAt', 'updatedAt'],
});
export default mongoose.models.Features ||
  mongoose.model('Features', FeaturesSchema);
