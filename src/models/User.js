import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: String,

    favorites: {
        type: [String],
        default: []   // ✅ AUTO-CREATES FIELD
    },

    visited: {
        type: [String],
        default: []   // ✅ AUTO-CREATES FIELD
    }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
