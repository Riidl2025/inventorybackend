const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")

// GET all inventory items
router.get("/", inventoryController.getAllItems)

// GET a single inventory item by name
router.get("/:name", inventoryController.getItemByName)

// GET low stock items
router.get("/status/low", inventoryController.getLowStockItems)

module.exports = router
