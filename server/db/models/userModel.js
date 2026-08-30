import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import uniqueValidator from 'mongoose-unique-validator';
import validator from 'validator';
import { userPermissionsEnum } from './permissionsEnum.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    id: { type: String, default: uuidv4, unique: true },

    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true,  validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Please provide a valid email address',
    } },
    password: { type: String, required: true },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },    
    role: {
      type: String,
      enum: ['ENTREPRENEUR', 'INVESTOR'],
      default: 'ENTREPRENEUR',
    },
    country: { type: String, required: false },
    user_background: { type: String },
    experience: { type: String },
    investment_preferences: [{ type: String }],
    id_nationality: {
      type: Number,
      min: [1, 'Nationality ID should be positive'],
    },    
    id_documents: [{type: String}],
    profile_image: {
      type: String,
      default: 'https://i.ibb.co/6WtQfMm/default.png',
    },
    permissions: {
        type: [String],
        enum: userPermissionsEnum,
        default: [
          'UPDATE_USER',
          'VIEW_USER',
          'DELETE_USER',
          'JOIN_COMMUNITY',
          'REMOVE_USER_FROM_COMMUNITY',
          'COMMENT_ON_PAGE',
          'VIEW_PAGE',
          'CREATE_PAGE',
          'LIKE_PAGE',
          'VIEW_COMMENTS',
          'VIEW_LIKES'
        ],
      },
    is_verified: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },

    // Feedback relationships
    feedback_maker: [{ type: String, ref: 'Feedback' }],
    feedback_getter: [{ type: String, ref: 'Feedback' }],

    // Relationships
    user_languages: [{ type: String, ref: 'UserLanguages' }],
    user_interests: [{ type: String, ref: 'UserInterests' }],
    last_login: { type: Date },

    // Communities
    user_communities: [{ type: String, ref: 'CommunityUsers' }],

    // Projects and Investments
    projects: [{ type: String, ref: 'Project' }],
    investments: [{ type: String, ref: 'Investment' }],

    // Messages
    messages_sent: [{ type: String, ref: 'Message' }],
    messages_received: [{ type: String, ref: 'Message' }],

    // Following
    following: [{ type: String }],

    // Refresh Token Hash
    refresh_token: { type: String, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const interestsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    admin_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserInterests',
      },
    ],
  },
  { timestamps: true },
);

const languagesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    admin_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserLanguages',
      },
    ],
  },
  { timestamps: true },
);

// UserInterests Schema (for many-to-many relationship)
const userInterestsSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    interest_id: {
      type: Schema.Types.ObjectId,
      ref: 'Interest',
      required: true,
    },
  },
  { timestamps: true },
);

// UserLanguages Schema (for many-to-many relationship)
const userLanguagesSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    language_id: {
      type: Schema.Types.ObjectId,
      ref: 'Languages',
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.plugin(uniqueValidator);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Interest = mongoose.models.Interest || mongoose.model('Interest', interestsSchema);
export const UserInterests = mongoose.models.UserInterests || mongoose.model('UserInterests', userInterestsSchema);
export const Languages = mongoose.models.Languages || mongoose.model('Languages', languagesSchema);
export const UserLanguages = mongoose.models.UserLanguages || mongoose.model('UserLanguages', userLanguagesSchema);

export default {
  User,
  Interest,
  UserInterests,
  Languages,
  UserLanguages,
};
