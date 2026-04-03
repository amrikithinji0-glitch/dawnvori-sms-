const twilio = require("twilio");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: "Missing 'to' phone number" });
  }

  const cleaned = to.replace(/\s+/g, "").replace(/[^\d+]/g, "");
  const formatted = cleaned.startsWith("+") ? cleaned : `+1${cleaned}`;

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: `Hey! Thanks for calling Dawnvori 😊 Here's your link to book a free 15-min demo of our AI Receptionist: ${process.env.BOOKING_LINK}`,
      from: process.env.TWILIO_FROM_NUMBER,
      to: formatted,
    });

    return res.status(200).json({ success: true, message: "SMS sent!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
