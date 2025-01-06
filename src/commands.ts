import { Context, Markup } from "telegraf";
var Users = require('./models/users');
const { OpenAI } = require('openai')

const genai = new OpenAI({ apiKey: "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" });

export class Commands {
  // Properties
  private ping: string
  private generateText = async (prompt: string) => {
    try {
      const completion = await genai.chat.completions.create({
        model: "gpt-3.5-turbo", // Specify the model you want to use
        messages: [
          { role: "system", content: "You are a helpful assistant for sports betting" },
          { role: "user", content: prompt },
        ],
      });

      console.log(completion.choices[0].message.content); // Output the generated text
    } catch (error) {
      console.error("Error generating text:", error);
    }
  }
  // Constructor
  constructor() {
    this.ping = "Hello World!"
  }
  // Main Menu
  public start = async (ctx: Context) => {
    (await Users.findOne({TgId:ctx.from?.id}))?console.log('already registered'):new Users({TgId:ctx.from?.id, FirstName:ctx.from?.first_name, UserName:ctx.from?.username}).save().then(console.log('successfuly created'));
    await ctx.reply(
      `🤖 Welcome to SportsBetPro Bot! 🏆  
  Your personal AI-powered betting assistant. What would you like to do today?  
  `,
      Markup.inlineKeyboard([
        [Markup.button.callback('🔎 Explore Games', 'explore_games')],
        [Markup.button.callback('⚙️ Settings', 'settings')]
      ])
    );
  }
  public test = async (ctx: Context) => {
    let a: any, b: any;
    if (ctx.message && 'text' in ctx.message) {
      console.log(ctx.message.text);
      a = ctx.message.text.split(" ")[1];
    }
    let basePrompt = `Today there are a match: ${a}. who will be the winner?, provide the result with one sentence and accurate percentage. such as 'Celtics to win, AI confidence is 87%' `
    let response:any = this.generateText(basePrompt)
    ctx.reply(response)
  }
}