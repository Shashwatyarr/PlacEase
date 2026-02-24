import dotenv from "dotenv";
dotenv.config();

import { Bot } from "grammy";
import PendingUser from "../models/pendingUser.js";

// Safety check
if (!process.env.AUTH_BOT_TOKEN) {
  throw new Error("AUTH_BOT_TOKEN is missing in .env");
}

const bot = new Bot(process.env.AUTH_BOT_TOKEN);

// ───── START COMMAND ─────
bot.command("start", async (ctx) => {
  try {
    const pendingId = ctx.match?.trim();

    if (!pendingId) {
      return ctx.reply("Invalid start link.");
    }

    const pending = await PendingUser.findById(pendingId);

    if (!pending) {
      return ctx.reply("Signup expired. Please register again.");
    }

    const chatId = ctx.chat.id.toString();
    const telegramUsername = ctx.from.username || null;

    // Save telegram info inside pending user
    await PendingUser.updateOne(
      { _id: pendingId },
      {
        telegramChatId: chatId,
        telegramLinkedAt: new Date(),
      },
    );

    await ctx.reply(
      `✅ PlacEase Connected!

PlacEase Account: ${pending.username}
Telegram: @${telegramUsername || "private"}

Now OTP will arrive here automatically.`,
    );
  } catch (error) {
    console.error("Telegram Error:", error);
    await ctx.reply("Something went wrong. Try again.");
  }
});

// Prevent bot crash
bot.catch((err) => {
  console.error("Bot Error:", err);
});

bot.start();

export default bot;
