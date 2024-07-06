import React, { useEffect, useState, useContext, Dispatch } from "react";
import { UserContext } from "../../Context/UserContext";
import "./bookTickets.css";
import axios from "axios";
const BookTickets = React.memo(() => {
  const [locationFrom, setLocationFrom] = useState("");
  const [locationTo, setLocationTo] = useState("");
  const [dayToFly, setDayToFly] = useState(Date());
  const [dayToSearch, setDayToSearch] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [listFly, setListFly] = useState([]);
  const { userData, setUserData } = useContext(UserContext) as {
    userData: any;
    setUserData: Dispatch<any>;
  };

  useEffect(() => {
    const fetch = async () => {
      const url = "http://192.168.41.26:8080/ticket/getallticket";
      let currentDate = new Date(dayToSearch);
      currentDate.setDate(currentDate.getDate());
      const result = await axios.post(url, { time: currentDate });

      if (result.status === 200) {
        setListFly(result.data);
      } else {
        setListFly([]);
      }
    };
    fetch();
  }, [dayToSearch]);

  const handleBuckTicket = async (value: any) => {
    try {
      if (true) {
        const url = "http://192.168.41.26:8080/ticket/registerticket";
        const data = {
          idUser: userData._id,
          idTicket: value,
        };
        const result = await axios.post(url, data);
        console.log(result);
        if (result.status === 200) {
          setUserData(result.data.user);

          const url = "http://192.168.41.26:8080/ticket/getallticket";
          let currentDate = new Date(dayToSearch);
          currentDate.setDate(currentDate.getDate());
          const resultTicket = await axios.post(url, { time: currentDate });

          if (resultTicket.status === 200) {
            setListFly(resultTicket.data);
          } else {
            setListFly([]);
          }
        }
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <>
      <div className="">
        <div className="list-ve m-5">
          <div>
            <label>Chon ngay: </label>
            <input
              className="border border-success m-2"
              type="date"
              value={dayToSearch}
              onChange={(e) => setDayToSearch(e.target.value)}
            />
          </div>
          <div className="tbl">
            <table className="table table-striped">
              <tbody>
                <tr className="text-center">
                  <th>Từ</th>
                  <th>Đến</th>
                  <th>Ngày</th>
                  <th>Tình trạng</th>
                  <th>Đặt vé</th>
                </tr>
                {listFly.map((item: any, index) => (
                  <tr key={index}>
                    <td>{item.from.name}</td>
                    <td>{item.to.name}</td>
                    <td>
                      {new Date(item.timeStart).toISOString().split("T")[0]} --
                      {new Date(item.timeStart).getHours()}:00:00
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      <button
                        onClick={() => handleBuckTicket(item._id)}
                        className="btn btn-success"
                      >
                        Đặt vé
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
});

export default BookTickets;
