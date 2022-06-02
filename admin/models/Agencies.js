import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const AgenciesSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true, unique: true, index: true },
    agentName: { type: String, required: true, unique: true, index: true },
    address: { type: String },
    logoImage: { type: String, default: '' },
    logoImageKey: { type: String, default: '' },
    finalFolder: { type: String, required: true },
    folderId: { type: String, required: true },
    city_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Countries' }],
    cityName: { type: String, required: true },
    province_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Countries' }],
    provinceName: { type: String, required: true },
    country_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Countries' }],
    countryName: { type: String, required: true },
    phones: [
      {
        tags: ['string'],
        number: 'string',
        remark: 'string',
      },
    ],
    email: { type: String, required: true, unique: true, index: true },
    currencyCode_id: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Currencies' },
    ],
    currencyCode: { type: String, required: true },
    creditAmount: { type: Number, required: true, default: 0 },
    depositAmount: { type: Number, required: true, default: 0 },
    remainCreditAmount: { type: Number, required: true, default: 0 },
    remainDepositAmount: { type: Number, required: true, default: 0 },
    userCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    userUpdated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    accountManager_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    accountManager: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isVercel: { type: Boolean },
    remark: { type: String },
  },
  { timestamps: true }
);
AgenciesSchema.plugin(timeZone);
export default mongoose.models.Agencies ||
  mongoose.model('Agencies', AgenciesSchema);
