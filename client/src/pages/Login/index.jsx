import React from "react";
import AuthForm from "../../components/Auth/AuthForm";
import { setItem, signInSchemas } from "../../utils/Functions";
import { useNavigate } from "react-router-dom";

import { paths } from "../../Router/Constant";
import { useDispatch } from "react-redux";
import { login } from "./actions";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const submitHandler = async (values) => {
    if (values) {
      const response = await dispatch(login(values));
    
      if (response.status === 201) {
        setItem("accessToken", response?.data?.token);
        navigate(paths.home);
      }
    }
  };
  return (
    <div>
      <AuthForm
        type="login"
        initialValues={initialValues}
        validationSchema={signInSchemas}
        submitHandler={submitHandler}
      />
    </div>
  );
};

export default Login;
