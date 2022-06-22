import mongoose from 'mongoose';
const timeZone = require('mongoose-timezone');
const RolesSchema = new mongoose.Schema(
  {
    roleName: { type: String, required: true, unique: true, index: true },
    users_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    isActive: { type: Boolean, default: true },
    remark: { type: String },
    icon: String,
    routes: [
      {
        path: String,
        'name_en-US': String,
        name_fa: String,
        icon: String,
        crud: [
          {
            name: String,
            active: Boolean,
          },
        ],
        views: [
          {
            path: String,
            'name_en-US': String,
            name_fa: String,
            crud: [
              {
                name: String,
                active: Boolean,
              },
            ],
            views: [
              {
                path: String,
                'name_en-US': String,
                name_fa: String,
                crud: [
                  {
                    name: String,
                    active: Boolean,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);
RolesSchema.plugin(timeZone);
export default mongoose.models.Roles || mongoose.model('Roles', RolesSchema);
