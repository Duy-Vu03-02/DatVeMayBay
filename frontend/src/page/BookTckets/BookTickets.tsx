import React, { useState } from "react";
import "./bookTickets.css";
const BookTickets = React.memo(() => {
  const [locationFrom, setLocationFrom] = useState("");
  const [locationTo, setLocationTo] = useState("");
  const [dayToFly, setDayToFly] = useState(Date());

  return (
    <>
      <div className="d-flex">
        <div className="list-ve">
          <table className="table table-striped">
            <tbody>
              <tr className="text-center">
                <th>Từ</th>
                <th>Đến</th>
                <th>Ngày</th>
                <th>Tình trạng</th>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="input-location d-flex">
          <div className="from">
            <p>Từ</p>
            <select
              value={locationFrom}
              onChange={(e) => setLocationFrom(e.target.value)}
            >
              <option value="hanoi">Hà Nội</option>
              <option value="danang">Đà Nẵng</option>
              <option value="hochiminh">Hồ Chí Minh</option>
            </select>
          </div>

          <div className="to">
            <p>Đến</p>
            <select
              value={locationTo}
              onChange={(e) => setLocationTo(e.target.value)}
            >
              <option value="hanoi">Hà Nội</option>
              <option value="danang">Đà Nẵng</option>
              <option value="hochiminh">Hồ Chí Minh</option>
            </select>
          </div>

          <div className="day-to-fly">
            <input
              type="date"
              value={dayToFly}
              onChange={(e) => setDayToFly(e.target.value)}
            />
          </div>

          <div className="result">
            <p></p>
          </div>
        </div>
      </div>
    </>
  );
});

export default BookTickets;
