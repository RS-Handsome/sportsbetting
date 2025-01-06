import { session, Telegraf, Markup } from "telegraf";
import { BOT_TOKEN } from './config';
import { Actions } from "./actions";
import { Commands } from "./commands";
import checkAuth from "./middleware/checkAuth";
import checkPayment from "./middleware/checkPayment";
require('mongoose').connect("mongodb://localhost:27017/sportsbetting");

const bot = new Telegraf(BOT_TOKEN);
const myActions = new Actions()
const myCommands = new Commands()

// bot.use(checkAuth);

// Handling commands
bot.start(myCommands.start);
bot.command("test", myCommands.test);

// Handling button actions
bot.action('explore_games', myActions.explore_games);
bot.action('soccer', myActions.soccer);
bot.action('basketball', myActions.basketball);
bot.action('football', myActions.football);
bot.action('basketball', myActions.basketball);
bot.action(/game_details_(.+)/, myActions.gamedetails);
bot.action(/get_analysis_(.+)/, myActions.get_analysis_game_id);
bot.action('upgrade_to_premium', myActions.upgrade_to_premium);
bot.action('confirm_paid', myActions.confirm_paid);
bot.action('back_to_main', myActions.main_menu);
bot.action('get_analysis', myActions.get_analysis);
bot.action('advanced_insights', myActions.advanced_insights);
bot.action('live_alert', myActions.live_alert);
bot.action('betting_portfolio', myActions.betting_portfolio);
bot.action('customize_strategies', myActions.customize_strategies);
bot.action('settings', myActions.settings);
bot.action('notifications', myActions.notifications);
bot.action('game_analysis', myActions.game_analysis);
bot.action('player_performance', myActions.player_performance);
bot.action('historical_trends', myActions.historical_trends);
bot.action('game_updates', myActions.game_updates);
bot.action(/game_updates_(.+)/, myActions.game_updates_gameid);
bot.action('manage_alerts', myActions.manage_alerts);
bot.action('recent_bets', myActions.recent_bets);
bot.action('roi_analysis', myActions.roi_analysis);
bot.action('analyze_more', myActions.analyze_more);
bot.action('tips_to_improve', myActions.tips_to_improve);
bot.action('more_features', myActions.more_features);
bot.action('daily_premium_picks', myActions.daily_premium_picks);
bot.action('odds_comparison', myActions.odds_comparison);
bot.action('custom_betting_strategies', myActions.custom_betting_strategies);
bot.action(/strategy_(.+)/, myActions.strategy_button);
bot.action('bet_simulator', myActions.bet_simulator);
bot.action('place_bet', myActions.place_bet);

bot.launch();