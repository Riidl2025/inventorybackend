const Inventory = require("../models/Inventory")
const Transaction = require("../models/Transaction")

// Add stock to inventory
exports.addStock = async (req, res) => {
  try {
    const { itemName, quantity, location } = req.body

    // Convert quantity to number
    const quantityNum = Number.parseInt(quantity, 10)

    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive number" })
    }

    // Check if item already exists
    let item = await Inventory.findOne({ name: itemName })

    if (item) {
      // Update existing item
      item.stockIn += quantityNum
      item.totalStock += quantityNum
      item.location = location
      await item.save()
    } else {
      // Create new item
      item = new Inventory({
        name: itemName,
        stockIn: quantityNum,
        stockOut: 0,
        totalStock: quantityNum,
        location,
      })
      await item.save()
    }

    // Record transaction
    const transaction = new Transaction({
      type: "in",
      itemName,
      quantity: quantityNum,
      location,
      date: new Date(),
    })
    await transaction.save()

    res.json({ success: true, message: "Stock added successfully", item })
  } catch (error) {
    console.error("Error adding stock:", error)
    res.status(500).json({ success: false, message: "Failed to add stock" })
  }
}

// Get stock in history
exports.getStockInHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: "in" }).sort({ date: -1 }).limit(50)

    res.json({ success: true, transactions })
  } catch (error) {
    console.error("Error fetching stock in history:", error)
    res.status(500).json({ success: false, message: "Failed to fetch stock in history" })
  }
}
