import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const CurrenciesSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, index: true },
    name: { type: String, required: true },
    iso3: { type: String, required: true },
    iso2: { type: String, required: true },
    agents_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agencies' }],
    numeric_code: { type: String, required: true },
    currency: { type: String, required: true },
    currency_name: { type: String, required: true },
    currency_symbol: { type: String, required: true },
    emoji: { type: String, required: true },
  },
  { timestamps: true }
);

CurrenciesSchema.plugin(timeZone, {
  path: ['createdAt', 'updatedAt'],
});
export default mongoose.models.Currencies ||
  mongoose.model('Currencies', CurrenciesSchema);
