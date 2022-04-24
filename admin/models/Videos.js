import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const VideosSchema = new mongoose.Schema(
  {
    title_en: { type: String, required: true },
    title_fa: { type: String, required: true },
    topTitle_en: { type: String, required: true },
    topTitle_fa: { type: String, required: true },
    subTitle_en: { type: String, required: true },
    subTitle_fa: { type: String, required: true },
    button_en: { type: String, required: true },
    button_fa: { type: String, required: true },
    imageMobileShowKey: { type: String, required: true },
    videoPosterKey: { type: String, required: true },
    videoLinkKey: { type: String, required: true },
    youTubeId: { type: String },
    finalFolder: { type: String, required: true },
    folderId: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    youTubeBanner: { type: Boolean, required: true },
    isVercel: { type: Boolean, required: true },
    imageMobileShow: { type: String, required: true },
    videoPoster: { type: String, required: true },
    videoLink: { type: String, required: true },
  },
  { timestamps: true }
);

VideosSchema.plugin(timeZone, {
  path: ['createdAt', 'updatedAt'],
});
export default mongoose.models.Videos || mongoose.model('Videos', VideosSchema);
