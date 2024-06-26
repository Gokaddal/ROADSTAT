import mongoose from 'mongoose';
const { models, model, Schema } = mongoose;

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
  email: { 
    type: String, 
    unique: true,
    trim: true,
    required: [true, 'Please enter your email address'],
  },
  username: { 
    type: String, 
    unique: true,
    trim: true,
    required: [true, 'Please choose a username'],
  },
  password: {
    type: String,
    required: [true, 'Please choose a password'],
  },
  /**verificationCode: {
    type: String,
    trim: true,
  },**/
  isVerified: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export const User = model('User', UserSchema);