import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');

const CountriesSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, index: true },
    users_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    agents_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agencies' }],
    name: { type: String, required: true },
    iso3: { type: String, required: true },
    iso2: { type: String, required: true },
    numeric_code: { type: String, required: true },
    phone_code: { type: String, required: true },
    capital: { type: String, required: false, default: '' },
    currency: { type: String, required: true },
    currency_name: { type: String, required: true },
    currency_symbol: { type: String, required: true },
    tld: { type: String, required: true },
    native: { type: String, required: true },
    region: { type: String, required: false, default: '' },
    subregion: { type: String, required: false, default: '' },
    timezones: [
      {
        zoneName: String,
        gmtOffset: Number,
        gmtOffsetName: String,
        abbreviation: String,
        tzName: String,
      },
    ],
    translations: {
      kr: String,
      br: String,
      pt: String,
      nl: String,
      hr: String,
      fa: String,
      de: String,
      es: String,
      fr: String,
      ja: String,
      it: String,
      cn: String,
      th: String,
    },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    emoji: { type: String, required: true },
    emojiU: { type: String, required: true },
    states: [
      {
        id: Number,
        name: String,
        state_code: String,
        latitude: String,
        longitude: String,
        type: { type: String, default: null },
        users_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
        agents_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agencies' }],
        cities: [
          {
            id: Number,
            name: String,
            latitude: String,
            longitude: String,
            users_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
            agents_id: [
              { type: mongoose.Schema.Types.ObjectId, ref: 'Agencies' },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

CountriesSchema.index({
  name: 'text',
  'states.name': 'text',
  'states.cities.name': 'text',
});

CountriesSchema.plugin(timeZone, {
  path: ['createdAt', 'updatedAt'],
});
export default mongoose.models.Countries ||
  mongoose.model('Countries', CountriesSchema);
