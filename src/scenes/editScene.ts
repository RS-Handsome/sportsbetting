import { Composer, Context, Scenes, } from "telegraf";
require('mongoose').connect("mongodb://localhost:27017/nwscoindev");
var Tasks = require("../models/task");
var Axios = require('axios');
var listCmds = ["/addtask", "/help", "/viewtask"];

interface MySession extends Scenes.WizardSession {
  // will be available globally under `ctx.session.mySessionProp`
  title:      string;
  category:   string;
  content:    string;
  link:       string;
  pointAward: number;
  coinAward:  number;
  step:       number;
}
interface MyContext extends Context {
  // will be available globally under `ctx.myContextProp`
  myContextProp: string;
  session:       MySession;
  scene:         Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
  wizard:        Scenes.WizardContextWizard<MyContext>;
}

export class EditScene {
  // Properties
  private taskId:     number
  private taskInfo:   { title: string; category: string; content: string; link: string; revenue:{point:number; coin:number;} };
  private stepHandler = new Composer<MyContext>();
  private validation  = async () => {return true;}

  // Constructor
  constructor() {
    this.taskId = 0;
    this.taskInfo = {title: "", category: "", content: "", link: "", revenue: {point: 0, coin: 0}};
    this.stepHandler.command('confirm', async ctx => {
      ctx.reply("great! congrate of editing new task!");
      this.invokeAPI();
      return ctx.scene.leave();
    });
    this.stepHandler.command('cancel', async ctx => {
      return ctx.scene.leave();
    });
  }

  // Method
  public invokeAPI = async () => {
    try {
      const res = await Axios.put(`https://8152-95-216-228-74.ngrok-free.app/admin/update/tasks/${this.taskId}`, this.taskInfo);
      return true;
    } catch (error) {
      console.error("API call failed:", error);
      return false;
    }
  }

  public getTaskById = async () => {
    let task = await Tasks.findOne({ id: this.taskId }); // Ensure 'id' is the correct field
    if (!task) return false;
    else {
      this.taskInfo.title = task.title;
      this.taskInfo.category = task.category;
      this.taskInfo.content = task.content;
      this.taskInfo.link = task.link;
      this.taskInfo.revenue = task.revenue;
      return true;
    }
}

  public main = new Scenes.WizardScene<MyContext>("editScene",
    async ctx => {
      await ctx.reply(`Step ${ctx.wizard.cursor}. Plz enter Id of the Task:`);
      ctx.wizard.next();
    },
    async ctx => {
      if (ctx.message && 'text' in ctx.message) {
        if(listCmds.includes(ctx.message.text)){ctx.scene.leave();return ctx.reply("If you want to invoke another Command, Please Retry.");}
        this.taskId = Number(ctx.message.text);
      }
      await this.getTaskById();
      await ctx.reply(`Step ${ctx.wizard.cursor}. Plz enter Title of the Task:\nCurrent Title: ${this.taskInfo.title}`);
      ctx.wizard.next();
    },
    async ctx => {
      if (ctx.message && 'text' in ctx.message) {
        if(listCmds.includes(ctx.message.text)){ctx.scene.leave();return ctx.reply("If you want to invoke another Command, Please Retry.");}
        this.taskInfo.title = ctx.message.text;
      }
      await ctx.reply(`Step ${ctx.wizard.cursor}. Plz enter the Category of the Task:\nCurrent Category: ${this.taskInfo.category}`);
      ctx.wizard.next();
    },
    async ctx => {
      if (ctx.message && 'text' in ctx.message) {
        if(listCmds.includes(ctx.message.text)){ctx.scene.leave();return ctx.reply("If you want to invoke another Command, Please Retry.");}
        this.taskInfo.category = ctx.message.text;
      }
      await ctx.reply(`Step ${ctx.wizard.cursor}. Plz enter the Content of the Task:\nCurrent Content: ${this.taskInfo.content}`);
      ctx.wizard.next();
    },
    async ctx => {
      if (ctx.message && 'text' in ctx.message) {
        if(listCmds.includes(ctx.message.text)){ctx.scene.leave();return ctx.reply("If you want to invoke another Command, Please Retry.");}
        this.taskInfo.content = ctx.message.text;
      }
      await ctx.reply(`Step ${ctx.wizard.cursor}. Plz enter the Link of the Task:\nCurrent Link: ${this.taskInfo.link}`);
      ctx.wizard.next();
    },
    async ctx => {
      if (ctx.message && 'text' in ctx.message) {
        if(listCmds.includes(ctx.message.text)){ctx.scene.leave();return ctx.reply("If you want to invoke another Command, Please Retry.");}
        this.taskInfo.link = ctx.message.text;
      }
      await ctx.reply(`Step ${ctx.wizard.cursor}. Plz enter the Point Revenue of the Task:\nCurrent Point Revenue: ${this.taskInfo.revenue.point}`);
      ctx.wizard.next();
    },
    async ctx => {
      if (ctx.message && 'text' in ctx.message) {
        if(listCmds.includes(ctx.message.text)){ctx.scene.leave();return ctx.reply("If you want to invoke another Command, Please Retry.");}
        this.taskInfo.revenue.point = Number(ctx.message.text);
      }
      await ctx.reply(`Step ${ctx.wizard.cursor}. Plz enter the Coin Revenue of the Task:\nCurrent Coin Revenue: ${this.taskInfo.revenue.coin}`);
      ctx.wizard.next();
    },
    async ctx => {
      if (ctx.message && 'text' in ctx.message) {
        if(listCmds.includes(ctx.message.text)){ctx.scene.leave();return ctx.reply("If you want to invoke another Command, Please Retry.");}
        this.taskInfo.revenue.coin = Number(ctx.message.text);
      }
      await ctx.reply(`
        Plz confirm you edited
        Title: ${this.taskInfo.title}
        Category: ${this.taskInfo.category}
        Content: ${this.taskInfo.content}
        Link: ${this.taskInfo.link}
        Point Revenue: ${this.taskInfo.revenue.point}
        Coin Revenue: ${this.taskInfo.revenue.coin}
      `);
      ctx.wizard.next();
      await ctx.reply("If you confirmed all data for new task, Plz enter /confirm to complete edit task\nIf you want to cancel, Plz enter /cancel");
    },
    this.stepHandler
  );
}
