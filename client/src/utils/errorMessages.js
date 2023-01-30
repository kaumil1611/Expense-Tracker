import { Empty } from "antd";
import React from "react";

export const errorReuiredMessage = (key) => {
  return (
    <React.Fragment>
      <span className="text-capitalize">{key.replace(/([a-z0-9])([A-Z])/g, '$1 $2')}</span> is required.
    </React.Fragment>
  );
};
export const errorRemoveSpaceMessage = (key) => {
  return (
    <React.Fragment>
      <span className="text-capitalize">Please remove space</span>
    </React.Fragment>
  );
};

export const errorValidationMessage = (key) => {
  return `Please provide valid ${key}.`;
};

const NoDataFoundTableError = (props) => {
  return (
    <div className="p-5">
      <Empty
        description={
          <span className="error-msg">{props.name} is not found!</span>
        }
      />
    </div>
  );
};

export default NoDataFoundTableError;
