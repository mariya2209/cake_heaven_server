const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' // 'admin' or 'user'
    },
    resetPasswordToken: {
        type: String,
        required: false
    }
});

// Compare Password Method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password);
};

// Pre-save hook to hash the password before saving
//UserSchema.pre('save', async function(next) {
    //if (!this.isModified('password')) return next();
    //const salt = await bcrypt.genSalt(10);
    //this.password = await bcrypt.hash(this.password, salt);
    //next();
//});

const User = mongoose.model('User', UserSchema);
module.exports = User;
