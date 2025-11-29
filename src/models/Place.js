import mongoose from "mongoose";

// ✅ EMBEDDED REVIEW SUB-SCHEMA
const EmbeddedReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    comment: {
        type: String,
        trim: true
    },

    user: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        email: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true });


//MAIN PLACE SCHEMA
const PlaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    building: String,
    description: String,

    noiseLevel: {
        type: String,
        enum: ["quiet", "moderate", "loud"],
        default: "moderate"
    },

    crowdedness: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },

    wifiQuality: {
        type: Number,
        min: 0,
        max: 5,
        default: 3
    },

    foodNearby: { type: Boolean, default: false },
    indoor: { type: Boolean, default: true },
    outdoor: { type: Boolean, default: false },

    location: {
        lat: Number,
        lng: Number,
        address: String
    },

    // ✅ EMBEDDED REVIEWS ARRAY
    reviews: {
        type: [EmbeddedReviewSchema],
        default: []   // ✅ Prevents undefined issues
    },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Place || mongoose.model("Place", PlaceSchema);
