const express = require("express")
const router = express.Router()
const stockOutController = require("../controllers/stockOutController")

// POST issue stock from inventory
router.post("/", stockOutController.issueStock)

// GET stock out history
router.get("/history", stockOutController.getStockOutHistory)

module.exports = router
