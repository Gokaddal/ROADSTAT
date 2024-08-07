import mongoose, { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'Please enter your first name'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Please enter your last name'],
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Please enter your username'],
  },
  email: { 
    type: String, 
    unique: true,
    trim: true,
    required: [true, 'Please enter your email address'],
  },
  password: {
    type: String,
    required: [true, 'Please choose a password'],
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: [true, 'Please enter your phone number'],
  },
  verificationCode: {
    type: String,
    trim: true,
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  userType: {
    type: String,
    enum: ['Individual', 'Organization']
  }
}, { timestamps: true });

export const User = model('User', UserSchema);
