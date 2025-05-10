const express = require("express")
const router = express.Router()
const returnController = require("../controllers/returnController")
const stockOutController = require("../controllers/stockOutController")

// GET pending returnable items
router.get("/pending", stockOutController.getPendingReturnables)

// GET return history
router.get("/history", returnController.getReturnHistory)

// POST process item return
router.post("/", returnController.processReturn)

module.exports = router
