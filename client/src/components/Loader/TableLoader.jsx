import React from "react";
import { Spinner } from "react-bootstrap";

const TableLoader = () => {
  return (
    <div className="p-5">
      <Spinner
        animation="border"
        variant="primary"
        className="p-5"
        style={{ animationDelay: "-0.1s" }}
      />
    </div>
  );
};

export default TableLoader;
