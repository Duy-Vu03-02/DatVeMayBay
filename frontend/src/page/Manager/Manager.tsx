import React, { useEffect, useState, Dispatch, useContext } from "react";
import axios from "axios";

const Manager = React.memo(() => {
  const [listFly, setListFly] = useState([]);
  const [dayToSearch, setDayToSearch] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetch = async () => {
      const url = "http://192.168.41.26:8080/ticket/getticketbyuser";
      const result = await axios.post(url, {}, { withCredentials: true });
      if (result.status === 200) {
        setListFly(result.data);
      } else {
        setListFly([]);
      }
    };
    fetch();
  }, []);

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
                    <td>{item.price}</td>
                    <td>
                      <button className="btn btn-success">Thanh toán</button>
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

export default Manager;
