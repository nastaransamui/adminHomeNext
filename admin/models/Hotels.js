import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const HotelsSchema = new mongoose.Schema(
  {
    Giataid: { type: String, index: true },
    city_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Countries' }],
    cityName: { type: String, required: true },
    hotelId: { type: Number, required: true, unique: true, index: true },
    hotelName: { type: String, required: true, index: true },
    address: { type: String },
    phones: { type: String },
    fax: { type: String },
    email: { type: String },
    url: { type: String },
    remark: { type: String },
    countryIso2: { type: String, required: true, index: true },
    countryName: { type: String, required: true },
    country_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Countries' }],
    hotelRating: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    province_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Countries' }],
    provinceName: { type: String },
    isActive: { type: Boolean, default: true },
    rooms_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rooms' }],
    facilities_id: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Facilities' },
    ],
    userCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    userUpdated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    isVercel: { type: Boolean, required: true },
    finalFolder: { type: String, required: true },
    countryFolder: { type: String, required: true },
    folderId: { type: String, required: true },
    hotelThumb: { type: String },
    hotelImages: [{ type: String }],
    imageKey: [{ type: String }],
  },
  { timestamps: true }
);
HotelsSchema.plugin(timeZone);
export default mongoose.models.Hotels || mongoose.model('Hotels', HotelsSchema);
