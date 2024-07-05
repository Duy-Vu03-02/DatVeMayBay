import React, { useState } from "react";

const Register = React.memo(({}) => {
  const [locationFrom, setLocationFrom] = useState("");

  console.log(locationFrom);
  return (
    <>
      <div>
        <div className="input-location">
          <div className="from">
            <select
              value={locationFrom}
              onChange={(e) => setLocationFrom(e.target.value)}
            >
              <option value="">Hà Nội</option>
              <option value="">Đà Nẵng</option>
              <option value="">Hồ Chí Minh</option>
            </select>
          </div>

          <div className="to"></div>
        </div>
      </div>
    </>
  );
});

export default Register;
