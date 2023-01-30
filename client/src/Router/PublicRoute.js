import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";

/*** 
@Purpose : Used to declare public route
@Parameter : {}
**/
const PublicRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default withRouter(PublicRoute);
