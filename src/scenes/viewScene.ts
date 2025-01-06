import { Composer, Context, Scenes, } from "telegraf";
require('mongoose').connect("mongodb://localhost:27017/nwscoindev");
var Tasks = require("../models/task");
var Axios = require('axios');

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

export class ViewScene {
  // Properties
  private taskId:     number;
  private taskInfo:   { title: string; category: string; content: string; link: string; revenue:{point:number; coin:number;} };
  private tasks: Object[];
  private stepHandler = new Composer<MyContext>();
  private validation  = async () => {return true;}

  // Constructor
  constructor() {
    this.taskId = 0;
    this.taskInfo = {title: "", category: "", content: "", link: "", revenue: {point: 0, coin: 0}};
    this.tasks = [];
    this.stepHandler.command('listTask', async ctx => {
      ctx.reply("great! congrate of deleting the task!");
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
      await Axios.delete(`https://8152-95-216-228-74.ngrok-free.app/admin/delete/task/${this.taskId}`);
      return true;
    } catch (error) {
      console.error("API call failed:", error);
      return false;
    }
  }

//   let table =
//   "Pos. |                  ID                 | Title                  | Reward | Visible |     Section    | \n";
// table +=
//   "-----|-------------------------------------|------------------------|--------|---------|----------------|\n";

  public formatTaskAsTable = (tasks:any) => {
    let table =
        "Pos.| ID  | Title                  | Reward  \n";
    table +=
        "----|-----|------------------------|-------\n";

    let idx = 1;
    tasks.map((task:any) => {
      let title = String(task.title);
      if (title.length > 22) {
          title = title.substring(0, 19) + "...";
      }
      table += `${String(idx).padEnd(4)}| ${String(task.id).padEnd(4)}| ${title.padEnd(23)}| ${String(task.revenue.point).padEnd(9)}\n`;
      idx += 1;
    });

    return table;
  };

  public getTasks = async () => {
    const res = await Axios.get('https://8152-95-216-228-74.ngrok-free.app/admin/get-tasks');
    this.tasks = res.data;
    if (!this.tasks) return false;
    else {
      return true;
    }
  }

  public main = new Scenes.WizardScene<MyContext>("viewScene",
    async ctx => {
      await this.getTasks();
      if(this.tasks){
        let table = this.formatTaskAsTable(this.tasks);
        await ctx.reply(`<pre>${table}</pre>`,{parse_mode: 'HTML'});
        return ctx.scene.leave();
      } else { 
        return ctx.scene.leave();
       }
    },
  );
}
