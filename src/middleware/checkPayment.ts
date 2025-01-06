import { Context, Scenes, session, Telegraf } from "telegraf";
const ALLOWED_ADMINS = [
  7463573141
]

async function checkPayment(ctx:Context, next:any) {
  const userId = ctx.from?.id || 0;
  if (ALLOWED_ADMINS.includes(userId)) {
      return next();
  } else {
      ctx.reply(' 💎 Please upgrade to premium ');
  }
}

export default checkPayment;
