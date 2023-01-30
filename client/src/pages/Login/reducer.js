import actionTypes from "../../actions/index";
/******************* 
@Purpose : Object containing paths for application
@Parameter : {}

******************/

const LoginReducer = (state = {}, action) => {
  switch (action.type) {


    case actionTypes.USER_LOGOUT:
      return {
        loading: false,
        data: {},
      };

    default:
      return state;
  }
};

export default LoginReducer;
