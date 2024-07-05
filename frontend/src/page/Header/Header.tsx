import React from "react";

const Header = React.memo(({}) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-2 bg-success">
        <div className="left-header text-body-secondary">
          <h5>Đặt Vé Máy Bay</h5>
        </div>

        <div className="right-header d-flex align-items-center">
          <button className="btn m-auto">Đặt Vé</button>
          <button className="btn m-auto mx-4">Quản Lý Vé</button>
        </div>
      </div>
    </>
  );
});

export default Header;
