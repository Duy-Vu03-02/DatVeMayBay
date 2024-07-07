import React, { useEffect, useState, Dispatch, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

const Manager = React.memo(() => {
  const [listFly, setListFly] = useState([]);
  const { userData } = useContext(UserContext) as {
    userData: any;
    setUserData: Dispatch<any>;
  };

  const fetchTicketByUser = async () => {
    const url = "http://192.168.41.26:8080/ticket/getticketbyuser";
    const result = await axios.post(url, {}, { withCredentials: true });
    if (result.status === 200) {
      setListFly(result.data);
      console.log(result.data);
    } else {
      setListFly([]);
    }
  };

  useEffect(() => {
    fetchTicketByUser();
  }, []);

  const handleCancelTicket = async (value: any) => {
    try {
      const url = "http://192.168.41.26:8080/ticket/canceltiketbyuser";
      const result = await axios.post(url, value, { withCredentials: true });

      if (result.status === 200) {
        fetchTicketByUser();
      }
      if (result.status === 201) {
        fetchTicketByUser();
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  const handlePayment = async (value: any) => {
    try {
      const url = "http://192.168.41.26:8080/ticket/paymentticket";
      const result = await axios.post(url, value, { withCredentials: true });
      console.log(result);
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <>
      <div className="">
        <h3 className="text-center m-4">Quản Lý Vé</h3>
        <div className="list-ve">
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
                  <th>Hủy vé</th>
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
                      {item.autoCancel ? (
                        <button className="btn btn-secondary">Đã bị hủy</button>
                      ) : (
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handlePayment({
                              idSoftFlight: item.idSoftFlight,
                              idUser: userData._id,
                              idTicket: item._id,
                            })
                          }
                        >
                          Thanh toán
                        </button>
                      )}
                    </td>
                    <td>
                      {item.autoCancel ? (
                        <button className="btn btn-secondary">Đã bị hủy</button>
                      ) : (
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleCancelTicket({
                              idSoftFlight: item.idSoftFlight,
                            })
                          }
                        >
                          Hủy vé
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

export default Manager;
