// const nodemailer = require("nodemailer")

// // Configure email transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST || "smtp.gmail.com",
//   port: Number.parseInt(process.env.EMAIL_PORT || "587", 10),
//   secure: process.env.EMAIL_SECURE === "true",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// })

// // Email address to send notifications to
// const notificationEmail = process.env.NOTIFICATION_EMAIL

// // Send low stock email notification
// exports.sendLowStockEmail = async (itemName, currentStock) => {
//   // Skip if notification email is not configured
//   if (!notificationEmail) {
//     console.warn("Notification email not configured. Skipping low stock alert.")
//     return
//   }

//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: notificationEmail,
//       subject: `Low Stock Alert: ${itemName}`,
//       html: `
//         <h1>Low Stock Alert</h1>
//         <p>The following item is running low in inventory:</p>
//         <ul>
//           <li><strong>Item:</strong> ${itemName}</li>
//           <li><strong>Current Stock:</strong> ${currentStock}</li>
//         </ul>
//         <p>Please order more of this item soon.</p>
//       `,
//     })

//     console.log(`Low stock email sent for ${itemName}`)
//     return true
//   } catch (error) {
//     console.error("Error sending low stock email:", error)
//     return false
//   }
// }

require('dotenv').config(); // Load .env variables

const nodemailer = require("nodemailer");

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Notification email recipient
const notificationEmail = process.env.NOTIFICATION_EMAIL;

/**
 * Sends low stock notification email for a specific inventory item.
 * @param {Object} itemDetails - The item details object
 * @param {string} itemDetails.name - Name of the item
 * @param {string} itemDetails.location - Location of the item
 * @param {number} itemDetails.currentStock - Current stock quantity
 * @param {number} threshold - Minimum stock threshold (default 2)
 */
async function sendLowStockEmail(itemDetails, threshold = 2) {
  if (!notificationEmail) {
    console.warn("Notification email not configured. Skipping low stock alert.");
    return false;
  }

  if (itemDetails.currentStock > threshold) {
    console.log(`Stock for ${itemDetails.name} is sufficient (${itemDetails.currentStock}). No email sent.`);
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: notificationEmail,
      subject: `⚠️ Low Stock Alert: ${itemDetails.name}`,
      html: `
        <h1>Low Stock Alert</h1>
        <p>The following item is running low in inventory:</p>
        <ul>
          <li><strong>Item:</strong> ${itemDetails.name}</li>
          <li><strong>Location:</strong> ${itemDetails.location}</li>
          <li><strong>Current Stock:</strong> ${itemDetails.currentStock}</li>
          <li><strong>Threshold:</strong> ${threshold}</li>
        </ul>
        <p>Please order more of this item soon.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Low stock email sent for ${itemDetails.name} (stock: ${itemDetails.currentStock})`);
    return true;
  } catch (error) {
    console.error("❌ Error sending low stock email:", error);
    return false;
  }
}

module.exports = { sendLowStockEmail };
