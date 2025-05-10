const mongoose = require("mongoose")

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  stockIn: {
    type: Number,
    required: true,
    default: 0,
  },
  stockOut: {
    type: Number,
    required: true,
    default: 0,
  },
  totalStock: {
    type: Number,
    required: true,
    default: 0,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
inventorySchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Update the updatedAt field before updating
inventorySchema.pre("updateOne", function (next) {
  this.update({}, { $set: { updatedAt: Date.now() } })
  next()
})

module.exports = mongoose.model("Inventory", inventorySchema)
