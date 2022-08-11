import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const Accommodationnull = new mongoose.Schema(
  {
    id: { type: Number, required: true, index: true },
    name: { type: String, required: true, unique: true },
    iso3: { type: String, required: true, unique: true },
    iso2: { type: String, required: true, unique: true, index: true },
    emoji: { type: String, required: true },
    hotels: [
      {
        Giataid: { type: String, required: true, index: true },
        city_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Countries' }],
        cityName: { type: String, required: true },
        hotelId: { type: Number, required: true, index: true },
        hotelName: { type: String, required: true, index: true },
        address: { type: String },
        phones: { type: String },
        fax: { type: String },
        email: { type: String },
        url: { type: String },
        countryIso2: { type: String, required: true },
        countryName: { type: String, required: true },
        country_id: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'Countries' },
        ],
        hotelRating: { type: String, required: true },
        latitude: { type: String, required: true },
        longitude: { type: String, required: true },
        province_id: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'Countries' },
        ],
        provinceName: { type: String },
        isActive: { type: Boolean, default: false },
        userCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
        userUpdated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
        isVercel: { type: Boolean, required: true },
        finalFolder: { type: String, required: true },
        countryFolder: { type: String, required: true },
        folderId: { type: String, required: true },
        hotelThumb: { type: String },
        hotelImages: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

Accommodationnull.plugin(timeZone);
export default mongoose.models.Accommodationnull ||
  mongoose.model('Accommodationnull', Accommodationnull);
