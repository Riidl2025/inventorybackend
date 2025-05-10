const Inventory = require("../models/Inventory")
const Transaction = require("../models/Transaction")

// Get dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    // Get all inventory items
    const inventory = await Inventory.find().sort({ name: 1 })

    // Get recent transactions
    const recentTransactions = await Transaction.find().sort({ date: -1 }).limit(10)

    // Get low stock items
    const lowStockItems = await Inventory.find({ totalStock: { $lte: 3 } }).sort({ totalStock: 1 })

    // Calculate summary statistics
    const totalItems = inventory.length
    const totalStockIn = inventory.reduce((sum, item) => sum + item.stockIn, 0)
    const totalStockOut = inventory.reduce((sum, item) => sum + item.stockOut, 0)
    const totalCurrentStock = inventory.reduce((sum, item) => sum + item.totalStock, 0)

    res.json({
      success: true,
      inventory,
      recentTransactions,
      lowStockItems,
      summary: {
        totalItems,
        totalStockIn,
        totalStockOut,
        totalCurrentStock,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    res.status(500).json({ success: false, message: "Failed to fetch dashboard data" })
  }
}
