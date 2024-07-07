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

                let currentDate1 = new Date();
                currentDate1.setDate(currentDate1.getDate() + 1);
                const ticket1 = {
                  timeStart: currentDate1,
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
                await TicketModel.create(ticket1);

                let currentDate2 = new Date();
                currentDate2.setDate(currentDate2.getDate() + 2);
                const ticket2 = {
                  timeStart: currentDate2,
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
                await TicketModel.create(ticket2);

                let currentDate3 = new Date();
                currentDate3.setDate(currentDate3.getDate() + 3);
                const ticket3 = {
                  timeStart: currentDate3,
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
                await TicketModel.create(ticket3);

                let currentDate4 = new Date();
                currentDate4.setDate(currentDate4.getDate() + 4);
                const ticket4 = {
                  timeStart: currentDate4,
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
                await TicketModel.create(ticket4);

                let currentDate5 = new Date();
                currentDate5.setDate(currentDate5.getDate() + 5);
                const ticket5 = {
                  timeStart: currentDate5,
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
                await TicketModel.create(ticket5);

                let currentDate6 = new Date();
                currentDate6.setDate(currentDate6.getDate() + 6);
                const ticket6 = {
                  timeStart: currentDate6,
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
                await TicketModel.create(ticket6);

                let currentDate7 = new Date();
                currentDate7.setDate(currentDate7.getDate() + 7);
                const ticket7 = {
                  timeStart: currentDate7,
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
                await TicketModel.create(ticket7);
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
