import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { adminPermissionsEnum } from './permissionsEnum.js';
import validator from 'validator';

const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    admin_id: { type: String, default: uuidv4, unique: true },
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true,  validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Please provide a valid email address',
    } },
    password: { type: String, required: true },
    profile_image: {
      type: String,
      default: 'https://res.cloudinary.com/djvjxp2am/image/upload/v1628684396/avatars/avatar-1_ymq8zg.png',
    },
    admin_state: {
      type: String,
      enum: ['APPROVER', 'REJECTOR'],
      default: 'APPROVER',
    },
    role: {
      type: String,
      enum: ['ADMIN', 'SUPER_ADMIN'],
      default: 'ADMIN',
    },
    permissions: {
      type: [String],
      enum: adminPermissionsEnum,
      default: ['CREATE_USER_OR_ADMIN'],
    },
    approved_pages: [{ type: String, ref: 'Page' }],
    communities: [{ type: String, ref: 'Community' }],
  },
  { timestamps: true },
);

AdminSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id; // Remove _id from the response
    return ret;
  }
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
