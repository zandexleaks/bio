import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

/**
 * Formats the data and sends it to the Discord webhook.
 */
async function sendToDiscord(
  ip: string,
  userAgent: string,
  ipInfo: any,
  webhookUrl: string,
) {
  const fields = [
    { name: "IP Address", value: `\`${ip}\``, inline: true },
    { name: "Country", value: ipInfo?.country || "N/A", inline: true },
    { name: "City", value: ipInfo?.city || "N/A", inline: true },
    { name: "ISP", value: ipInfo?.isp || "N/A", inline: true },
    { name: "Latitude", value: String(ipInfo?.lat || "N/A"), inline: true },
    { name: "Longitude", value: String(ipInfo?.lon || "N/A"), inline: true },
    { name: "User Agent", value: `\`\`\`${userAgent}\`\`\``, inline: false },
  ]

  // Filter out any fields with 'N/A' values for a cleaner look
  const validFields = fields.filter(
    (field) => field.value && !field.value.includes("N/A"),
  )

  const embed = {
    title: "!",
    description: "A new user has visited the site.",
    color: 0x5865f2, // Discord blurple
    fields: validFields,
    timestamp: new Date().toISOString(),
    footer: {
      text: "ss",
    },
  }

  try {
    await axios.post(webhookUrl, { embeds: [embed] })
    console.log("Successfully sent visitor information to Discord.")
  } catch (error) {
    console.error("Failed to send information to Discord:", error)
  }
}

/**
 * Main handler for incoming GET requests to /api/log-visit
 */
export async function GET(req: NextRequest) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL is not set in the .env file.")
    // We don't want to expose this error to the user.
    return NextResponse.json(
      { message: "Server configuration error." },
      { status: 500 },
    )
  }

  // Get IP address. 'x-forwarded-for' is important for getting the real IP
  // when your app is behind a proxy (e.g., on Vercel).
  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0]

  // Get User Agent
  const userAgent = req.headers.get("user-agent") || "N/A"

  try {
    // Fetch geolocation data from ip-api.com
    const ipInfoResponse = await axios.get(`http://ip-api.com/json/${ip}`)
    const ipInfo = ipInfoResponse.data

    // Send the collected information to your Discord webhook.
    // We do this without `await` so we don't block the response to the client.
    sendToDiscord(ip, userAgent, ipInfo, webhookUrl)

    // Send a simple success response back to the visitor's browser.
    return NextResponse.json({ message: "Visit logged." })
  } catch (error) {
    console.error("An error occurred while processing the request:", error)
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 },
    )
  }
}

