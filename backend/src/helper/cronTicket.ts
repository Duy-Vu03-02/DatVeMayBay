import { UserModel } from "../model/UserModel";
import cron from "node-cron";

const handleCornTicket = async () => {
  try {
    // cron.schedule("* * * * *", async () => {
    //   const now: string = JSON.stringify(new Date());
    //   const user = {
    //     username: now,
    //     phone: now,
    //     authentication: {
    //       password: now,
    //     },
    //     account: now,
    //   };
    //   const newUser = await UserModel.create(user);
    //   console.log(newUser);
    // });
  } catch (err) {
    console.error(err);
  }
};

export default handleCornTicket;
