import React, { useEffect, useState, useContext, Dispatch } from "react";
import { UserContext } from "../../Context/UserContext";
import "./bookTickets.css";
import axios from "axios";
const BookTickets = React.memo(() => {
  const [dayToSearch, setDayToSearch] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [listFly, setListFly] = useState([]);
  const { userData, setUserData } = useContext(UserContext) as {
    userData: any;
    setUserData: Dispatch<any>;
  };

  const fetch_db = async () => {
    const url = "http://localhost:8080/ticket/getallticket";
    let currentDate = new Date(dayToSearch);
    currentDate.setDate(currentDate.getDate());
    const result = await axios.post(
      url,
      { time: currentDate },
      { withCredentials: true }
    );

    if (result.status === 200) {
      setListFly(result.data);
    } else {
      setListFly([]);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetch_db();
    };
    fetch();
  }, [dayToSearch]);

  const handleBuckTicket = async (value: any) => {
    try {
      if (true) {
        const url = "http://localhost:8080/ticket/registerticket";
        const data = {
          idUser: userData._id,
          idTicket: value,
        };
        const result = await axios.post(url, data, { withCredentials: true });

        if (result.status === 200) {
          setUserData(result.data.user);
          fetch_db();
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
        <h3 className="text-center mt-4">Đặt Vé</h3>
        <div className="list-ve m-2">
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
                  <th>Số lượng</th>
                  <th>Tình trạng</th>
                  <th>Giá</th>
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
                      {item.quantity > 0 ? (
                        <p className="bg-success">Còn vé</p>
                      ) : (
                        <p className="bg-body-secondary">Hết vé</p>
                      )}
                    </td>
                    <td>{item.price}</td>
                    <td>
                      {userData &&
                      userData?.flight?.some(
                        (temp: any) => temp.idTicket === item._id
                      ) ? (
                        <button className="btn btn-secondary">Đã đặt</button>
                      ) : (
                        <button
                          onClick={() => handleBuckTicket(item._id)}
                          className={
                            item.quantity > 0
                              ? "btn btn-success"
                              : "btn btn-secondary"
                          }
                        >
                          Đặt vé
                        </button>
                      )}
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
