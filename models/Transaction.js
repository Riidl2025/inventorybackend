// const mongoose = require("mongoose")

// const transactionSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["in", "out"],
//     required: true,
//   },
//   itemName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1,
//   },
//   location: {
//     type: String,
//     required: function () {
//       return this.type === "in"
//     },
//     trim: true,
//   },
//   issuedTo: {
//     type: String,
//     required: function () {
//       return this.type === "out"
//     },
//     trim: true,
//   },
//   issuedItemType: {
//     type: String,
//     enum: ["returnable", "nonReturnable"],
//     required: function () {
//       return this.type === "out"
//     },
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// })

// module.exports = mongoose.model("Transaction", transactionSchema)

const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["in", "out", "return"],
    required: true,
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  location: {
    type: String,
    required: function () {
      return this.type === "in" || this.type === "return"
    },
    trim: true,
  },
  issuedTo: {
    type: String,
    required: function () {
      return this.type === "out"
    },
    trim: true,
  },
  issuedItemType: {
    type: String,
    enum: ["returnable", "nonReturnable"],
    required: function () {
      return this.type === "out"
    },
  },
  returnStatus: {
    type: String,
    enum: ["pending", "returned", "notApplicable"],
    default: "notApplicable",
  },
  returnDate: {
    type: Date,
  },
  relatedTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Transaction", transactionSchema)
