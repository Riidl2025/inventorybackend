const Inventory = require("../models/Inventory")

// Get all inventory items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ name: 1 })
    res.json({ success: true, items })
  } catch (error) {
    console.error("Error fetching inventory items:", error)
    res.status(500).json({ success: false, message: "Failed to fetch inventory items" })
  }
}

// Get a single inventory item by name
exports.getItemByName = async (req, res) => {
  try {
    const item = await Inventory.findOne({ name: req.params.name })

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" })
    }

    res.json({ success: true, item })
  } catch (error) {
    console.error("Error fetching inventory item:", error)
    res.status(500).json({ success: false, message: "Failed to fetch inventory item" })
  }
}

// Get low stock items (items with totalStock <= 3)
exports.getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find({ totalStock: { $lte: 3 } }).sort({ totalStock: 1 })
    res.json({ success: true, items })
  } catch (error) {
    console.error("Error fetching low stock items:", error)
    res.status(500).json({ success: false, message: "Failed to fetch low stock items" })
  }
}
