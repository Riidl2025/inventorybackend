// const Inventory = require("../models/Inventory")

// // Get all inventory items
// exports.getAllItems = async (req, res) => {
//   try {
//     const items = await Inventory.find().sort({ name: 1 })
//     res.json({ success: true, items })
//   } catch (error) {
//     console.error("Error fetching inventory items:", error)
//     res.status(500).json({ success: false, message: "Failed to fetch inventory items" })
//   }
// }

// // Get a single inventory item by name
// exports.getItemByName = async (req, res) => {
//   try {
//     const item = await Inventory.findOne({ name: req.params.name })

//     if (!item) {
//       return res.status(404).json({ success: false, message: "Item not found" })
//     }

//     res.json({ success: true, item })
//   } catch (error) {
//     console.error("Error fetching inventory item:", error)
//     res.status(500).json({ success: false, message: "Failed to fetch inventory item" })
//   }
// }

// // Get low stock items (items with totalStock <= 3)
// exports.getLowStockItems = async (req, res) => {
//   try {
//     const items = await Inventory.find({ totalStock: { $lte: 3 } }).sort({ totalStock: 1 })
//     res.json({ success: true, items })
//   } catch (error) {
//     console.error("Error fetching low stock items:", error)
//     res.status(500).json({ success: false, message: "Failed to fetch low stock items" })
//   }
// }


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

// Update inventory item by ID
exports.updateItem = async (req, res) => {
  try {
    console.log(`UPDATE REQUEST - ID: ${req.params.id}`)
    console.log(`UPDATE REQUEST - Body:`, req.body)

    const { id } = req.params
    const { name, stockIn, stockOut, location } = req.body

    // Validate required fields
    if (!name || stockIn === undefined || stockOut === undefined || !location) {
      console.log("Validation failed - missing fields")
      return res.status(400).json({
        success: false,
        message: "All fields (name, stockIn, stockOut, location) are required",
      })
    }

    // Calculate total stock
    const totalStock = Number.parseInt(stockIn) - Number.parseInt(stockOut)

    console.log(`Updating item with ID: ${id}`)
    console.log(
      `New values: name=${name}, stockIn=${stockIn}, stockOut=${stockOut}, totalStock=${totalStock}, location=${location}`,
    )

    // Find and update the item
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        stockIn: Number.parseInt(stockIn),
        stockOut: Number.parseInt(stockOut),
        totalStock: totalStock,
        location: location.trim(),
        updatedAt: new Date(),
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Run mongoose validators
      },
    )

    if (!updatedItem) {
      console.log(`Item not found with ID: ${id}`)
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      })
    }

    console.log(`Successfully updated item: ${updatedItem.name}`)

    res.json({
      success: true,
      message: "Inventory item updated successfully",
      item: updatedItem,
    })
  } catch (error) {
    console.error("Error updating inventory item:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      })
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to update inventory item: " + error.message,
    })
  }
}

// Delete inventory item by ID
exports.deleteItem = async (req, res) => {
  try {
    console.log(`DELETE REQUEST - ID: ${req.params.id}`)

    const { id } = req.params

    // Find and delete the item
    const deletedItem = await Inventory.findByIdAndDelete(id)

    if (!deletedItem) {
      console.log(`Item not found with ID: ${id}`)
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      })
    }

    console.log(`Successfully deleted item: ${deletedItem.name}`)

    res.json({
      success: true,
      message: "Inventory item deleted successfully",
      item: deletedItem,
    })
  } catch (error) {
    console.error("Error deleting inventory item:", error)

    // Handle cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid item ID format",
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete inventory item: " + error.message,
    })
  }
}

// Create new inventory item
exports.createItem = async (req, res) => {
  try {
    console.log(`CREATE REQUEST - Body:`, req.body)

    const { name, stockIn, stockOut, location } = req.body

    // Validate required fields
    if (!name || stockIn === undefined || stockOut === undefined || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, stockIn, stockOut, location) are required",
      })
    }

    // Check if item already exists
    const existingItem = await Inventory.findOne({ name: name.trim() })
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Item with this name already exists",
      })
    }

    // Calculate total stock
    const totalStock = Number.parseInt(stockIn) - Number.parseInt(stockOut)

    // Create new item
    const newItem = new Inventory({
      name: name.trim(),
      stockIn: Number.parseInt(stockIn),
      stockOut: Number.parseInt(stockOut),
      totalStock: totalStock,
      location: location.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const savedItem = await newItem.save()

    console.log(`Successfully created item: ${savedItem.name}`)

    res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      item: savedItem,
    })
  } catch (error) {
    console.error("Error creating inventory item:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error: " + error.message,
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to create inventory item: " + error.message,
    })
  }
}
