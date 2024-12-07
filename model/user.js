const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    country: {
        type: String,
        required: true
    },
     
    
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    
    notificationsCount: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpiry: {
        type: Date,
        default: null
    },
    subscription: {
        plan: {
          type: String,
          enum: ['Standard', 'Premium'],
          required: false,
        },
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
        remainingEmails: {
          type: Number,
          required: false,
        },
        status: {
          type: String,
          enum: ['active', 'inactive', 'canceled', 'expired'],
          default: 'inactive',
        },
      },

    firebaseUID:{
        type: String,
       default: null
    }

   
   

}, {
    timestamps: true
});

// Hash password before saving user
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare hashed passwords
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
