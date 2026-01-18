const e = require("express");
const { Types, Schema, model } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "shops";
const DOCUMENT_NAME = "Shop";

// Declare the Schema of the Mongo model
const shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    password: {
      type: String,
      required: true,
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    role: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
