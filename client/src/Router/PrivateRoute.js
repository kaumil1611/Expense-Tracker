import { Navigate, Outlet } from "react-router-dom";
import { Authorization } from "../utils/Functions";
import { paths } from "./Constant";

export const PrivateRoute = () => {
  return Authorization() ? <Outlet /> : <Navigate to={paths.login} />;
};
