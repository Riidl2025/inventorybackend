const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboardController")

// GET dashboard data
router.get("/", dashboardController.getDashboardData)

module.exports = router
