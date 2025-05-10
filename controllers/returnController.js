const Inventory = require("../models/Inventory")
const Transaction = require("../models/Transaction")

// Process item return
exports.processReturn = async (req, res) => {
  try {
    const { transactionId, returnQuantity, location, returnDate } = req.body

    // Convert quantity to number
    const returnQuantityNum = Number.parseInt(returnQuantity, 10)

    if (isNaN(returnQuantityNum) || returnQuantityNum <= 0) {
      return res.status(400).json({ success: false, message: "Return quantity must be a positive number" })
    }

    // Find the original transaction
    const originalTransaction = await Transaction.findById(transactionId)

    if (!originalTransaction) {
      return res.status(404).json({ success: false, message: "Original transaction not found" })
    }

    if (originalTransaction.type !== "out" || originalTransaction.issuedItemType !== "returnable") {
      return res.status(400).json({ success: false, message: "This transaction is not a returnable item" })
    }

    if (originalTransaction.returnStatus === "returned") {
      return res.status(400).json({ success: false, message: "This item has already been returned" })
    }

    if (returnQuantityNum > originalTransaction.quantity) {
      return res.status(400).json({
        success: false,
        message: `Cannot return more than was issued. Maximum: ${originalTransaction.quantity}`,
      })
    }

    // Find the inventory item
    const item = await Inventory.findOne({ name: originalTransaction.itemName })

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in inventory" })
    }

    // Update inventory - IMPORTANT: We only update totalStock, NOT stockIn
    // This ensures returnable items don't get double-counted in the stockIn total
    item.totalStock += returnQuantityNum
    await item.save()

    // Update the original transaction
    originalTransaction.returnStatus = returnQuantityNum === originalTransaction.quantity ? "returned" : "pending"
    originalTransaction.returnDate = new Date(returnDate || Date.now())
    await originalTransaction.save()

    // Record return transaction
    const returnTransaction = new Transaction({
      type: "return",
      itemName: originalTransaction.itemName,
      quantity: returnQuantityNum,
      location,
      relatedTransactionId: originalTransaction._id,
      date: new Date(returnDate || Date.now()),
    })
    await returnTransaction.save()

    res.json({
      success: true,
      message: "Item returned successfully",
      item,
      originalTransaction,
      returnTransaction,
    })
  } catch (error) {
    console.error("Error processing return:", error)
    res.status(500).json({ success: false, message: "Failed to process return" })
  }
}

// Get return history
exports.getReturnHistory = async (req, res) => {
  try {
    const returns = await Transaction.find({ type: "return" }).sort({ date: -1 }).limit(50)

    res.json({ success: true, returns })
  } catch (error) {
    console.error("Error fetching return history:", error)
    res.status(500).json({ success: false, message: "Failed to fetch return history" })
  }
}
