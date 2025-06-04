// const express = require("express")
// const router = express.Router()
// const inventoryController = require("../controllers/inventoryController")

// // GET all inventory items
// router.get("/", inventoryController.getAllItems)

// // GET a single inventory item by name
// router.get("/:name", inventoryController.getItemByName)

// // GET low stock items
// router.get("/status/low", inventoryController.getLowStockItems)

// module.exports = router


const express = require("express")
const router = express.Router()
const inventoryController = require("../controllers/inventoryController")

// GET routes
router.get("/", inventoryController.getAllItems)
router.get("/low-stock", inventoryController.getLowStockItems)

// PUT route (update existing item) - MUST come before /:name route
router.put("/:id", inventoryController.updateItem)

// DELETE route (delete item) - MUST come before /:name route
router.delete("/:id", inventoryController.deleteItem)

// POST route (create new item)
router.post("/", inventoryController.createItem)

// GET single item by name - MUST be last to avoid conflicts
router.get("/:name", inventoryController.getItemByName)

module.exports = router
