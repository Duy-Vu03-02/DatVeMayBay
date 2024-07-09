import React, { useEffect, useState, Dispatch, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import moment from "moment";

const Manager = React.memo(() => {
  const [listFly, setListFly] = useState([]);
  const { userData } = useContext(UserContext) as {
    userData: any;
    setUserData: Dispatch<any>;
  };

  const fetchTicketByUser = async () => {
    const url = "http://localhost:8080/ticket/getticketbyuser";
    const result = await axios.post(url, {}, { withCredentials: true });
    if (result.status === 200) {
      setListFly(result.data);
    } else {
      setListFly([]);
    }
  };

  useEffect(() => {
    fetchTicketByUser();
  }, []);

  const handleCancelTicket = async (value: any) => {
    try {
      const url = "http://localhost:8080/ticket/canceltiketbyuser";
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
      const url = "http://localhost:8080/ticket/paymentticket";
      const result = await axios.post(url, value, { withCredentials: true });
      if (result.status === 200) {
        fetchTicketByUser();
      }
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
                  <th>Xác nhận đặt vé</th>
                </tr>
                {listFly.map((item: any, index) => (
                  <tr key={index}>
                    <td>{item.from.name}</td>
                    <td>{item.to.name}</td>
                    <td>
                      {moment(item.timeStart).format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>
                      {!item.ablePayment ? (
                        <button className="btn btn-secondary">
                          {item.state}
                        </button>
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
                          {item.state}
                        </button>
                      )}
                    </td>
                    <td>
                      {!item.ableCancel ? (
                        <button className="btn btn-secondary">
                          {item.state}
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleCancelTicket({
                              idSoftFlight: item.idSoftFlight,
                              idTicket: item._id,
                              idUser: userData._id,
                            })
                          }
                        >
                          Hủy vé
                        </button>
                      )}
                    </td>
                    <td>
                      {item.timePayment &&
                        moment(item.timePayment).format("DD/MM/YYYY HH:mm:ss")}
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
