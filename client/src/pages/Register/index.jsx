import React from "react";
import AuthForm from "../../components/Auth/AuthForm";
import { signUpSchemas } from "../../utils/Functions";
import { useNavigate } from "react-router-dom";

import { paths } from "../../Router/Constant";
import { useDispatch } from "react-redux";
import { registerUser } from "./actions";

const Register = () => {
  const initialValues = {
    userName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    totalExpenseLimit: 0,
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (values) => {
    if (values) {
      const response = await dispatch(registerUser(values));
      if (response.status === 200 || response.status === 208) {
        navigate(paths.login);
      }
    }
  };
  return (
    <div>
      <AuthForm
        type="register"
        initialValues={initialValues}
        validationSchema={signUpSchemas}
        submitHandler={submitHandler}
      />
    </div>
  );
};

export default Register;
