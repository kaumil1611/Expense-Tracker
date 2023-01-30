import { toast } from "react-toastify";
// import swal from "sweetalert";

import store from "../store";
import * as Yup from "yup";

/*******************
@Purpose : Store Data To local Storage
@Parameter : key, value

******************/
export const setItem = (key, value) => {
  localStorage.setItem(key, value);
};

/******************* 
  @Purpose : Get Data From local Storage
  @Parameter : key
  ******************/
export const getItem = (key) => {
  return localStorage.getItem(key);
};

/******************* 
  @Purpose : Remove Data in local Storage
  @Parameter : key

  ******************/
export const removeItem = (key) => {
  localStorage.removeItem(key);
};

/******************* 
  @Purpose : Used to check weather user is logged in or not
  @Parameter : key
  ******************/
export const Authorization = () => {
  return getItem("accessToken") ? true : false;
};

/******************* 
@Purpose : Used to show sucess toast messages
@Parameter : message

******************/
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 1800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/******************* 
@Purpose : Used to show error toast messages
@Parameter : message

******************/
export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 1800,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/******************* 
  @Purpose : Used to check user login page
  @Parameter : 
  ******************/

export const signInSchemas = Yup.object({
  email: Yup.string()
    .matches(/^[^@]+@gmail\.com$/, "Email must be a gmail address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required.")
    .matches(
      /^(?=.*[A-Z])(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{4,12}$/,
      "Password must have at least 1 capital letter, 1 optional special character like @,#,$,% and have minimum 4 and maximum 12 characters including optional 0-9 numbers"
    ),
});

/******************* 
  @Purpose : Used to check user sign up page
  @Parameter : 
  ******************/
export const signUpSchemas = Yup.object({
  userName: Yup.string()
    .matches(
      /^[A-Za-z0-9][A-Za-z0-9]{2,8}$/,
      "Name must have minimum 2 characters and maximum 8 characters and contains only numbers"
    )
    .required("username is required"),
  email: Yup.string()
    .matches(/^[^@]+@gmail\.com$/, "Email must be a gmail address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required.")
    .matches(
      /^(?=.*[A-Z])(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{4,12}$/,
      "Password must have at least 1 capital letter, 1 optional special character like @,#,$,% and have minimum 4 and maximum 12 characters including optional 0-9 numbers"
    ),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  totalExpenseLimit: Yup.number()
    .min(0, "Total expense limit must be greater than or equal to 0")
    .required("Total expense limit is required"),
});
