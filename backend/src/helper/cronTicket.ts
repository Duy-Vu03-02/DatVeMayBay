import { UserModel } from "../model/UserModel";
import { LocationModel } from "../model/LocationModel";
import cron from "node-cron";
import { TicketModel } from "../model/TicketModel";

const handleCornTicket = async () => {
  try {
    cron.schedule(
      "0 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23 * * *",
      async () => {
        const location = await LocationModel.find();
        const n = location.length;
        if (n > 1) {
          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
              if (i !== j) {
                console.log("create");
                let currentDate = new Date();
                const ticket = {
                  timeStart: currentDate,
                  from: {
                    idLocation: location[i]._id,
                    name: location[i].name,
                  },
                  to: {
                    idLocation: location[j]._id,
                    name: location[j].name,
                  },
                  quantity: 10,
                };
                await TicketModel.create(ticket);
              }
            }
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
};

export default handleCornTicket;
