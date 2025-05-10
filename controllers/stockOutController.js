// const Inventory = require("../models/Inventory")
// const Transaction = require("../models/Transaction")
// const { sendLowStockEmail } = require("../utils/emailService")

// // Issue stock from inventory
// exports.issueStock = async (req, res) => {
//   try {
//     const { itemName, issuedTo, quantity, issuedItemType, date } = req.body

//     // Convert quantity to number
//     const quantityNum = Number.parseInt(quantity, 10)

//     if (isNaN(quantityNum) || quantityNum <= 0) {
//       return res.status(400).json({ success: false, message: "Quantity must be a positive number" })
//     }

//     // Check if item exists and has enough stock
//     const item = await Inventory.findOne({ name: itemName })

//     if (!item) {
//       return res.status(404).json({ success: false, message: "Item not found in inventory" })
//     }

//     if (item.totalStock < quantityNum) {
//       return res.status(400).json({
//         success: false,
//         message: `Not enough stock available. Current stock: ${item.totalStock}`,
//       })
//     }

//     // Update inventory
//     item.stockOut += quantityNum
//     item.totalStock -= quantityNum
//     await item.save()

//     // Record transaction
//     const transaction = new Transaction({
//       type: "out",
//       itemName,
//       issuedTo,
//       quantity: quantityNum,
//       issuedItemType,
//       returnStatus: issuedItemType === "returnable" ? "pending" : "notApplicable",
//       date: new Date(date),
//     })
//     await transaction.save()

//     // Check if stock is low after this transaction
//     if (item.totalStock <= 3) {
//       // Send low stock notification
//       await sendLowStockEmail(itemName, item.totalStock)
//     }

//     res.json({ success: true, message: "Stock issued successfully", item })
//   } catch (error) {
//     console.error("Error issuing stock:", error)
//     res.status(500).json({ success: false, message: "Failed to issue stock" })
//   }
// }

// // Get stock out history
// exports.getStockOutHistory = async (req, res) => {
//   try {
//     const transactions = await Transaction.find({ type: "out" }).sort({ date: -1 }).limit(50)

//     res.json({ success: true, transactions })
//   } catch (error) {
//     console.error("Error fetching stock out history:", error)
//     res.status(500).json({ success: false, message: "Failed to fetch stock out history" })
//   }
// }

// // Get pending returnable items
// exports.getPendingReturnables = async (req, res) => {
//   try {
//     const pendingItems = await Transaction.find({
//       type: "out",
//       issuedItemType: "returnable",
//       returnStatus: "pending",
//     }).sort({ date: 1 })

//     res.json({ success: true, pendingItems })
//   } catch (error) {
//     console.error("Error fetching pending returnable items:", error)
//     res.status(500).json({ success: false, message: "Failed to fetch pending returnable items" })
//   }
// }

const Inventory = require("../models/Inventory");
const Transaction = require("../models/Transaction");
const { sendLowStockEmail } = require("../utils/emailService");

// Issue stock from inventory
exports.issueStock = async (req, res) => {
  try {
    const { itemName, issuedTo, quantity, issuedItemType, date } = req.body;

    const quantityNum = Number.parseInt(quantity, 10);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive number" });
    }

    // Find item
    const item = await Inventory.findOne({ name: itemName });

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in inventory" });
    }

    if (item.totalStock < quantityNum) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock available. Current stock: ${item.totalStock}`,
      });
    }

    // Update inventory
    item.stockOut += quantityNum;
    item.totalStock -= quantityNum;
    await item.save();

    // Record transaction
    const transaction = new Transaction({
      type: "out",
      itemName,
      issuedTo,
      quantity: quantityNum,
      issuedItemType,
      returnStatus: issuedItemType === "returnable" ? "pending" : "notApplicable",
      date: new Date(date),
    });
    await transaction.save();

    // ✅ Trigger low stock email if stock <= 2
    if (item.totalStock <= 5) {
      console.log(`Low stock detected for ${itemName}: ${item.totalStock}`);

      // ✅ Pass object to email function
      await sendLowStockEmail({
        name: item.name,
        location: item.location || "N/A", // if you have location field in schema
        currentStock: item.totalStock,
      });
    }

    res.json({ success: true, message: "Stock issued successfully", item });

  } catch (error) {
    console.error("Error issuing stock:", error);
    res.status(500).json({ success: false, message: "Failed to issue stock" });
  }
};

// Get stock out history
exports.getStockOutHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: "out" }).sort({ date: -1 }).limit(50);
    res.json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching stock out history:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stock out history" });
  }
};

// Get pending returnable items
exports.getPendingReturnables = async (req, res) => {
  try {
    const pendingItems = await Transaction.find({
      type: "out",
      issuedItemType: "returnable",
      returnStatus: "pending",
    }).sort({ date: 1 });

    res.json({ success: true, pendingItems });
  } catch (error) {
    console.error("Error fetching pending returnable items:", error);
    res.status(500).json({ success: false, message: "Failed to fetch pending returnable items" });
  }
};
