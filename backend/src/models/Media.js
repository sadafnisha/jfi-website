const mongoose = require("mongoose");

// Photos / videos the admin uploads; they are shown on the home page under the hero section.
const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video"], required: true },
    storedName: { type: String, required: true, unique: true },
    originalName: { type: String, default: "" },
    mimeType: { type: String, required: true },
    size: { type: Number, default: 0 },
    caption: { type: String, default: "", maxlength: 200, trim: true },
  },
  { timestamps: true }
);

mediaSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Media", mediaSchema);
