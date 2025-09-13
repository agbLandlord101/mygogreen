import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    const { message, userIp } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let locationInfo = "";

    if (userIp) {
      try {
        const locationResponse = await axios.get(`https://ipwho.is/${userIp}`);
        const location = locationResponse.data;

        if (location.success) {
          locationInfo = `
IP Address: ${userIp}
Country: ${location.country}
City: ${location.city}
ISP: ${location.connection.isp}
`;
        } else {
          locationInfo = "Geolocation lookup failed.";
        }
      } catch (error) {
        console.log(error)
        locationInfo = "Failed to fetch location.";
      }
    } else {
      locationInfo = "User IP not provided.";
    }

    const finalMessage = `${message}\n\n📍 Location Info:\n${locationInfo}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: finalMessage,
    });

    if (response.data.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: response.data.description }, { status: 500 });
    }
  } catch (err) {
    console.error("Error sending Telegram message:", err);
    return NextResponse.json({ error: "Failed to send Telegram message" }, { status: 500 });
  }
}
