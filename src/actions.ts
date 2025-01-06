import { Context, Markup } from "telegraf";
import { keyboard } from "telegraf/typings/markup";
import { Score24 } from "./score24";
import { MyGoogle } from "./mygoogle";
require('mongoose').connect("mongodb://localhost:27017/sportsbetting");
var Basketball = require("./models/basketball");
var Soccer = require('./models/soccer');
var Football = require('./models/football');
var Users = require('./models/users');
var Activities = require('./models/activities');
var Emoji = require("./models/emoji");

const MyScore24 = new Score24()
const Mygoogle = new MyGoogle()

export class Actions {
  private ping: string
  constructor() { this.ping = "Hello World!" }

  public main_menu = async (ctx: Context) => {
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
  public explore_games = async (ctx: Context) => {
    await ctx.reply(
      `We let you explore games by sports\nPlease choose a sport to explore today's games:`,
      Markup.inlineKeyboard([
        [Markup.button.callback('⚽ Soccer', 'soccer'), Markup.button.callback('🏀 Basketball', 'basketball')],
        [Markup.button.callback('🏈 Football', 'football'), Markup.button.callback('🎾 Tennis', 'tennis')],
        [Markup.button.callback(`⬅️ Back to Main Menu`, 'back_to_main')]
      ])
    );
  }
  public get_analysis = async (ctx: Context) => {
    ctx.reply(
      `💎 **Welcome to Premium Features!**  
Choose a feature to enhance your betting experience:`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`📊 Advanced Insights`, 'advanced_insights'), Markup.button.callback(`🔔 Live Alerts`, 'live_alert')],
        [Markup.button.callback(`📈 Betting Portfolio`, 'betting_portfolio'), Markup.button.callback(`⚙️ Customize Strategies`, 'customize_strategies')],
        [Markup.button.callback(`➕ More Features`, 'more_features'), Markup.button.callback(`⬅️ Back to Main Menu`, 'back_to_main')],
      ])
    );
  }
  public settings = async (ctx: Context) => {
    ctx.reply(
      '⚙️ **Settings**\nWhat would you like to customize?',
      Markup.inlineKeyboard([
        [Markup.button.callback('🔔 Notifications', 'notifications')],
        [Markup.button.callback('🏆 Favorite Teams/Leagues', 'favorite_teams')],
        [Markup.button.callback('💳 Premium Subscription', 'premium_subscription')],
        [Markup.button.callback('⬅️ Back to Main Menu', 'back_to_main')]
      ])
    );
  }
  public soccer = async (ctx: Context) => {
    const activity = await Activities.findOne({ TgId: ctx.from?.id });
    if (activity) {
      activity.CurrentSport = "soccer"; await activity.save();
    } else {
      new Activities({ TgId: ctx.from?.id, CurrentSport: "soccer" }).save()
    }
    await Soccer.deleteMany({});
    let list: any = await MyScore24.get_match_list("soccer");
    let keyboard = []
    list.forEach((game: any) => {
      keyboard.push([Markup.button.callback(` ${game.GameId}. ${game.GameTitle} ( ${game.Time} ) `, `game_details_soccer_${game.GameId}`)]);
      const list = new Soccer({
        GameId: game.GameId, GameTitle: game.GameTitle, Time: game.Time, Status: game.Status, Link: game.Link
      });
      list.save()
    });
    keyboard.push([Markup.button.callback('⬅️ Back to Sports', 'explore_games')])
    await ctx.reply(
      '⚽ Here you can see all Soccer Games - Today',
      Markup.inlineKeyboard(keyboard)
    );
  }
  public basketball = async (ctx: Context) => {
    const activity = await Activities.findOne({ TgId: ctx.from?.id });
    if (activity) {
      activity.CurrentSport = "basketball"; await activity.save();
    } else {
      new Activities({ TgId: ctx.from?.id, CurrentSport: "basketball" }).save();
    }
    await Basketball.deleteMany({});
    let list: any = await MyScore24.get_match_list("basketball");
    let keyboard = []
    list.forEach((game: any) => {
      keyboard.push([Markup.button.callback(` ${game.GameId}. ${game.GameTitle} ( ${game.Time} ) `, `game_details_basketball_${game.GameId}`)]);
      const list = new Basketball({
        GameId: game.GameId, GameTitle: game.GameTitle, Time: game.Time, Status: game.Status, Link: game.Link
      });
      list.save()
    });
    keyboard.push([Markup.button.callback('⬅️ Back to Sports', 'explore_games')])
    await ctx.reply(
      '⚽ Here you can see all Basketball Games - Today',
      Markup.inlineKeyboard(keyboard)
    );
    // let games = []
    // games = await Basketball.find({})
    // let emojis = await Emoji.find({})
    // let keyboard = []
    // games.forEach((game: any, index: any) => {
    //   keyboard.push([Markup.button.callback(`  ${emojis[index + 1].emoji}. ${game.GameTitle} ( ${game.Time} ) `, `game_details_basketball_${game.GameId}`)])
    // });
    // keyboard.push([Markup.button.callback('⬅️ Back to Sports', 'explore_games')])
    // await ctx.reply(
    //   '🏀 Here you can see all NBA Games - Today',
    //   Markup.inlineKeyboard(keyboard)
    // );
  }
  public football = async (ctx: Context) => {
    const activity = await Activities.findOne({ TgId: ctx.from?.id });
    if (activity) {
      activity.CurrentSport = "football"; await activity.save();
    } else {
      new Activities({ TgId: ctx.from?.id, CurrentSport: "football" }).save();
    }
    await Football.deleteMany({});
    let list: any = await MyScore24.get_match_list("american-football");
    let keyboard = []
    list.forEach((game: any) => {
      keyboard.push([Markup.button.callback(` ${game.GameId}. ${game.GameTitle} ( ${game.Time} ) `, `game_details_football_${game.GameId}`)]);
      const list = new Football({
        GameId: game.GameId, GameTitle: game.GameTitle, Time: game.Time, Status: game.Status, Link: game.Link
      });
      list.save()
    });
    keyboard.push([Markup.button.callback('⬅️ Back to Sports', 'explore_games')])
    await ctx.reply(
      '⚽ Here you can see all American Football Games - Today',
      Markup.inlineKeyboard(keyboard)
    );
  }
  public tennis = async (ctx: Context) => {
    ctx.reply("Coming soon...")
  }
  public gamedetails = async (ctx: Context) => {
    let game: any = {};
    let sport: any;
    let overview: any;
    if (ctx.callbackQuery) {
      const gameId: any = ctx.callbackQuery;
      sport = gameId.data.split("_")[2];
      let gameid = gameId.data.split("_")[3];
      const activity = await Activities.findOne({ TgId: ctx.from?.id });
      if (activity) {
        activity.CurrentMatch = gameid; await activity.save();
      } else {
        new Activities({ TgId: ctx.from?.id, CurrentMatch: gameid }).save();
      }
      // GET game details related with <gameId?.data> and reply
      switch (sport) {
        case "basketball":
          game = await Basketball.findOne({ GameId: gameid });
          console.log(game)
          overview = await MyScore24.get_match_overview(game.Link);
          break;
        case "soccer":
          game = await Soccer.findOne({ GameId: gameid });
          overview = await MyScore24.get_match_overview(game.Link);
          break;
        case "football":
          game = await Football.findOne({ GameId: gameid });
          console.log(game)
          overview = await MyScore24.get_match_overview(game.Link);
          break;
      }
    }
    await ctx.reply(
      `🏀 Game: ${game.GameTitle}  
  📅 Date: ${game.createdAt} 
  ⏰ Time: ${game.Time} EST  
  📍 Venue: ${overview[0].Venue}  
  
  Would you like to see AI insights for this game?`,
      Markup.inlineKeyboard([
        [Markup.button.callback('🧠 Get Analysis', `get_analysis_${sport}_${game.GameId}`), Markup.button.callback('⬅️ Back to Games', sport)],
      ])
    );
  }
  public get_analysis_game_id = async (ctx: Context) => {
    let game: any;
    let sport: any;
    let overview: any;
    if (ctx.callbackQuery) {
      const gameId: any = ctx.callbackQuery;
      sport = gameId.data.split("_")[2];
      let gameid = gameId.data.split("_")[3];
      // GET game details related with <gameId?.data> and reply
      switch (sport) {
        case "basketball":
          game = await Basketball.findOne({ GameId: gameid });
          overview = await MyScore24.get_match_overview(game.Link);
          break;
        case "soccer":
          game = await Soccer.findOne({ GameId: gameid });
          overview = await MyScore24.get_match_overview(game.Link);
          break;
        case "football":
          game = await Football.findOne({ GameId: gameid });
          overview = await MyScore24.get_match_overview(game.Link);
          break;
      }
    }
    const userInfo = await Users.findOne({ TgId: ctx.from?.id });
    if (userInfo.Premium) {
      await ctx.reply(
        `💎 **Welcome to Premium Features!**  
  Choose a feature to enhance your betting experience:`,
        Markup.inlineKeyboard([
          [Markup.button.callback(`📊 Advanced Insights`, 'advanced_insights'), Markup.button.callback(`🔔 Live Alerts`, 'live_alert')],
          [Markup.button.callback(`📈 Betting Portfolio`, 'betting_portfolio'), Markup.button.callback(`⚙️ Customize Strategies`, 'customize_strategies')],
          [Markup.button.callback(`➕ More Features`, 'more_features'), Markup.button.callback(`⬅️ Back to Main Menu`, 'back_to_main')],
        ])
      );
    } else {
      await ctx.reply(
        `🧠 **${game.GameTitle} - AI Insights (Free Tier)**  
  📊 **Basic Insights:**  
    - In ${overview[0].Team1} wins ${overview[0].Team1Wins} 
    - In ${overview[0].Team2} wins ${overview[0].Team2Wins} 
  🔒 **Unlock Full Analysis:**  
    - Advanced trends, predictions, and hidden opportunities available for Premium users.`,
        Markup.inlineKeyboard([
          [Markup.button.callback('💎 Upgrade to Premium', 'upgrade_to_premium'), Markup.button.callback('⬅️ Back to Specific Game', `game_details_${sport}_${game.GameId}`)],
        ])
      );
    }
  }
  public upgrade_to_premium = async (ctx: Context) => {
    ctx.reply(` 💎 Thanks for your upgrading to Premium
  🔑 To unlock your premium functions, deposit 1 SOL
  💳 demoaddress_sdf9898w98ehf9834hf34fh9384f4
  `,
      Markup.inlineKeyboard([
        [Markup.button.callback('confirm_on_test', 'confirm_paid')],
      ]))
  }
  public confirm_paid = async (ctx: Context) => {
    const user = await Users.findOne({ TgId: ctx.from?.id });
    user.Premium = true;
    await user.save().then(
      ctx.reply("💐Congrats! successfuly upgraded to Premium!")
    );
  }
  public notifications = async (ctx: Context) => {
    ctx.reply(
      `🔔 **Notifications:**\n` +
      `1️⃣ Game updates: [${true ? '✅ Enabled' : '❌ Disabled'}]\n` +
      `2️⃣ Insights for Lakers: [${false ? '✅ Enabled' : '❌ Disabled'}]\n\n` +
      `Tap to toggle:`,
      Markup.inlineKeyboard([
        [Markup.button.callback('1️⃣ Toggle Game Updates', 'toggle_game_updates')],
        [Markup.button.callback('2️⃣ Toggle Insights for Lakers', 'toggle_insights_lakers')],
        [Markup.button.callback('⬅️ Back to Settings', 'settings')]
      ])
    );
  }
  public favorite_teams = async (ctx: Context) => {
    ctx.reply("😁 You clicked favorite_teams Button")
  }
  public premium_subscription = async (ctx: Context) => {
    ctx.reply("😁 You clicked premium_subscription Button")
  }
  public advanced_insights = async (ctx: Context) => {
    await ctx.reply(
      `📊 **Advanced Insights**  
Choose the type of insight you’d like:`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`📋 Game Analysis`, 'game_analysis')],
        [Markup.button.callback(`⭐ Player Performance`, 'player_performance')],
        [Markup.button.callback(`📈 Historical Trends`, 'historical_trends')],
        [Markup.button.callback(`⬅️ Back to Premium Menu`, 'get_analysis')]
      ])
    );
  }
  public live_alert = async (ctx: Context) => {
    await ctx.reply(
      `🔔 **Live Alerts**  
What would you like to track?`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`📅 Game Updates`, 'game_updates')],
        [Markup.button.callback(`⚠️ Line Movements`, 'line_movements')],
        [Markup.button.callback(`🔥 Best Live Bets`, 'best_live_bets')],
        [Markup.button.callback(`⬅️ Back to Premium Menu`, 'get_analysis')]
      ])
    );
  }
  public betting_portfolio = async (ctx: Context) => {
    await ctx.reply(
      `📈 **Betting Portfolio**  
What would you like to see?`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`📋 Recent Bets`, 'recent_bets')],
        [Markup.button.callback(`📊 ROI Analysis`, 'roi_analysis')],
        [Markup.button.callback(`📝 Tips to Improve`, 'tips_to_improve')],
        [Markup.button.callback(`⬅️ Back to Premium Menu`, 'get_analysis')]
      ])
    );
  }
  public customize_strategies = async (ctx: Context) => {
    ctx.reply(`😁You clicked customize_strategies button`)
  }
  public game_analysis = async (ctx: Context) => {
    let game: any;
    let prediction: any;
    let aiinsight: any;
    let basePrompt: any;
    const activity = await Activities.findOne({ TgId: ctx.from?.id });
    switch (activity.CurrentSport) {
      case "soccer":
        game = await Soccer.findOne({ GameId: activity.CurrentMatch });
        prediction = await MyScore24.get_match_prediction(game.Link);
        basePrompt = `Today, there are a match ${game.GameTitle}.who will be the winner?, provide the result with one sentence and accurate percentage. such as'Celtics to win, AI confidence is 87%' with this data: ${prediction[0]}`
        aiinsight = await MyScore24.get_ai_insight(basePrompt);
        prediction[0] = await MyScore24.get_ai_insight(`rewrite with 3 sentences: ${prediction[0]}`)
        console.log(aiinsight)
        break;
      case "basketball":
        game = await Basketball.findOne({ GameId: activity.CurrentMatch });
        prediction = await MyScore24.get_match_prediction(game.Link);
        basePrompt = `Today, there are a match ${game.GameTitle}.who will be the winner?, provide the result with one sentence and accurate percentage. such as'Celtics to win, AI confidence is 87%' with this data: ${prediction[0]}`
        aiinsight = await MyScore24.get_ai_insight(basePrompt);
        prediction[0] = await MyScore24.get_ai_insight(`rewrite with 3 sentences: ${prediction[0]}`)
        console.log(aiinsight)
        break;
      case "football":
        game = await Football.findOne({ GameId: activity.CurrentMatch });
        prediction = await MyScore24.get_match_prediction(game.Link);
        basePrompt = `Today, there are a match ${game.GameTitle}.who will be the winner?, provide the result with one sentence and accurate percentage. such as'Celtics to win, AI confidence is 87%' with this data: ${prediction[0]}`
        aiinsight = await MyScore24.get_ai_insight(basePrompt);
        prediction[0] = await MyScore24.get_ai_insight(`rewrite with 3 sentences: ${prediction[0]}`)
        console.log(aiinsight)
        break;
    }
    await ctx.reply(
      `🏀 **${game.GameTitle} - Advanced Analysis**\n` +
      `📊 **Stats & Trends:**\n` +
      `   ${prediction[0]}\n` +
      `🔥 **Betting Insight:**\n` +
      `   🥇 ${aiinsight} \n`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`🔎 See More Stats`, 'see_more_stats'), Markup.button.callback(`⬅️ Back to Insights`, 'advanced_insights')]
      ])
    );
  }
  public player_performance = async (ctx: Context) => {
    const activity = await Activities.findOne({ TgId: ctx.from?.id });
    let game4player:any;
    let result:any;
    let teams:any;
    switch (activity.CurrentSport) {
      case "soccer":
        game4player = await Soccer.findOne({ GameId: activity.CurrentMatch });
        teams = game4player.GameTitle.split(' vs ');
        ctx.reply(`${await Mygoogle.get_team_link(`players list of ${teams[0]} soccer teams`)}\n${await Mygoogle.get_team_link(`players list of ${teams[1]} soccer teams`)}`)
        break;
      case "basketball":
        game4player = await Basketball.findOne({ GameId: activity.CurrentMatch });
        teams = game4player.GameTitle.split(' vs ');
        ctx.reply(`${await Mygoogle.get_team_link(`players list of ${teams[0]} basketball teams`)}\n${await Mygoogle.get_team_link(`players list of ${teams[1]} basketball teams`)}`)
        break;
      case "football":
        game4player = await Football.findOne({ GameId: activity.CurrentMatch });
        teams = game4player.GameTitle.split(' vs ');
        ctx.reply(`${await Mygoogle.get_team_link(`players list of ${teams[0]} football teams`)}\n${await Mygoogle.get_team_link(`players list of ${teams[1]} football teams`)}`)
        break;
    }
    // ctx.reply(result);
    // ctx.reply(' 😁 You clicked player_performance button');
  }
  public historical_trends = async (ctx: Context) => {
    let game: any;
    let prediction: any;
    let aiinsight: any;
    let basePrompt: any;
    const activity = await Activities.findOne({ TgId: ctx.from?.id });
    switch (activity.CurrentSport) {
      case "soccer":
        game = await Soccer.findOne({ GameId: activity.CurrentMatch });
        await MyScore24.get_match_trends(game.Link);
        // prediction = await MyScore24.get_match_prediction(game.Link);
        // basePrompt = `Today, there are a match ${game.GameTitle}.who will be the winner?, provide the result with one sentence and accurate percentage. such as'Celtics to win, AI confidence is 87%' with this data: ${prediction[0]}`
        // aiinsight = await MyScore24.get_ai_insight(basePrompt);
        // console.log(aiinsight)
        break;
      case "basketball":
        game = await Basketball.findOne({ GameId: activity.CurrentMatch });
        prediction = await MyScore24.get_match_prediction(game.Link);
        basePrompt = `Today, there are a match ${game.GameTitle}.who will be the winner?, provide the result with one sentence and accurate percentage. such as'Celtics to win, AI confidence is 87%' with this data: ${prediction[0]}`
        aiinsight = await MyScore24.get_ai_insight(basePrompt);
        console.log(aiinsight)
        break;
      case "football":
        game = await Football.findOne({ GameId: activity.CurrentMatch });
        prediction = await MyScore24.get_match_prediction(game.Link);
        basePrompt = `Today, there are a match ${game.GameTitle}.who will be the winner?, provide the result with one sentence and accurate percentage. such as'Celtics to win, AI confidence is 87%' with this data: ${prediction[0]}`
        aiinsight = await MyScore24.get_ai_insight(basePrompt);
        prediction[0] = await MyScore24.get_ai_insight(`rewrite with 3 sentences: ${prediction[0]}`)
        console.log(aiinsight)
        break;
    }
  }
  public see_more_stats = async (ctx: Context) => {
    ctx.reply("😁 You clicked See More Stats Button")
  }
  public game_updates = async (ctx: Context) => {
    let games = [
      { GameId: 1, GameIcon: "🏀", GameTitle: "Lakers", Time: "(8:00 PM)" },
      { GameId: 1, GameIcon: "🏈", GameTitle: "NFL", Time: "(8:00 PM)" },
      { GameId: 1, GameIcon: "⚽", GameTitle: "English Premier League", Time: "(8:00 PM)" },
    ]
    let keyboard = []
    games.forEach((game, index) => {
      keyboard.push([Markup.button.callback(`  ${game.GameIcon} ${game.GameTitle} ${game.Time}  `, `game_updates_${game.GameId}`)])
    })
    keyboard.push([Markup.button.callback('⬅️ Back to Live Alerts', 'live_alert')])
    await ctx.reply(
      '📅 **Game Alerts**\nSet alerts for specific teams or leagues:',
      Markup.inlineKeyboard(keyboard)
    );
  }
  public game_updates_gameid = async (ctx: Context) => {
    await ctx.reply(
      `✅ You’ll now receive live updates for Lakers games.`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`🔄 Manage Alerts`, 'manage_alerts')],
        [Markup.button.callback(`⬅️ Back to Live Alerts`, 'live_alert')]
      ])
    );
  }
  public manage_alerts = async (ctx: Context) => {
    ctx.reply("😁 You clicked Manage Alert Button")
  }
  public recent_bets = async (ctx: Context) => {
    ctx.reply("😁 You clicked Recent Bets Button")
  }
  public roi_analysis = async (ctx: Context) => {
    await ctx.reply(
      `📊 **ROI Analysis**\n` +
      `- Total Bets: 50\n` +
      `- Wins: 30 (60%)\n` +
      `- ROI: +12%\n` +
      `📝 **Tip:** You perform best with spreads. Focus on spread bets for higher returns!`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`🔍 Analyze More`, 'analyze_more')],
        [Markup.button.callback(`⬅️ Back to Portfolio`, 'betting_portfolio')]
      ])
    );
  }
  public analyze_more = async (ctx: Context) => {
    ctx.reply("😁 You clicked Anaylize More Button")
  }
  public tips_to_improve = async (ctx: Context) => {
    ctx.reply("😁 You clicked tips_to_improve Button")
  }
  public more_features = async (ctx: Context) => {
    await ctx.reply(
      `➕ **More Features**\nExplore additional premium tools:`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`🎯 Daily Premium Picks`, 'daily_premium_picks')],
        [Markup.button.callback(`📋 Custom Betting Strategies`, 'custom_betting_strategies')],
        [Markup.button.callback(`🎲 Bet Simulator`, 'bet_simulator')],
        [Markup.button.callback(`📋 Odds Comparison`, 'odds_comparison')],
        [Markup.button.callback(`⬅️ Back to Premium Dashboard`, 'get_analysis')]
      ])
    );
  }
  public daily_premium_picks = async (ctx: Context) => {
    await ctx.reply(
      `🎯 **Daily Premium Picks**\n\n` +
      `1️⃣ **Lakers vs. Celtics**\n` +
      `   - Bet: Lakers to win.\n` +
      `   - Confidence: 87%.\n` +
      `2️⃣ **Warriors vs. Suns**\n` +
      `   - Bet: Over 220.5 points.\n` +
      `   - Confidence: 79%.`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`📊 See Analysis for Game 1`, 'see_analysis_game_1')],
        [Markup.button.callback(`⬅️ Back to Premium Menu`, 'more_features')]
      ])
    );
  }
  public odds_comparison = async (ctx: Context) => {
    await ctx.reply(
      `📋 Select a game to compare odds:`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`🏀 Lakers vs. Celtics`, 'compare_lakers_celtics')],
        [Markup.button.callback(`🏀 Warriors vs. Suns`, 'compare_warriors_suns')],
        [Markup.button.callback(`⬅️ Back to Premium Menu`, 'more_features')]
      ])
    );
  }
  public custom_betting_strategies = async (ctx: Context) => {
    await ctx.reply(
      `📋 **Custom Betting Strategies**\nChoose a strategy to tailor your experience:`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`🛡️ Conservative`, 'strategy_conservative')],
        [Markup.button.callback(`⚡ Aggressive`, 'strategy_aggressive')],
        [Markup.button.callback(`🔄 Balanced`, 'strategy_balanced')],
        [Markup.button.callback(`⬅️ Back to Premium Menu`, 'more_features')]
      ])
    );
  }
  public strategy_button = async (ctx: Context) => {
    await ctx.reply(
      `🛡️ **Conservative Strategy Selected**\n` +
      `- Focus: Low-risk bets with high AI confidence.\n` +
      `- Notifications: Enabled for moneyline and spread bets.`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`🔄 Change Strategy`, 'custom_betting_strategies')],
        [Markup.button.callback(`⬅️ Back to Strategies`, 'bet_simulator')]
      ])
    );
  }
  public bet_simulator = async (ctx: Context) => {
    await ctx.reply(
      `🎲 **Bet Simulator**\n` +
      `- Bet: $100 on Lakers (+130).\n` +
      `- Potential Return: $230.\n\n` +
      `Risk Level: Moderate.\n` +
      `Lakers have an 87% chance of winning based on AI analysis.`,
      Markup.inlineKeyboard([
        [Markup.button.callback(`💰 Place Bet`, 'place_bet')],
        [Markup.button.callback(`⬅️ Back to Premium Menu`, 'back_to_premium_menu')]
      ])
    );
  }
  public place_bet = async (ctx: Context) => {
    ctx.reply("😁 You clicked place_bet Button")
  }
}