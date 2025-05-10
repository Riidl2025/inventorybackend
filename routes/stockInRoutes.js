const express = require("express")
const router = express.Router()
const stockInController = require("../controllers/stockInController")

// POST add stock to inventory
router.post("/", stockInController.addStock)

// GET stock in history
router.get("/history", stockInController.getStockInHistory)

module.exports = router
