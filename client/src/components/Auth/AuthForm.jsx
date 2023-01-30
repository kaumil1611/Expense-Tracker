import React from "react";
import { useFormik } from "formik";
import { Form, Button } from "react-bootstrap";
import { Input } from "antd";
import { Alert, Spinner } from "react-bootstrap";

const AuthForm = ({ type, initialValues, validationSchema, submitHandler }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: submitHandler,
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="form-control">
      {formik.status && formik.status.error && (
        <Alert variant="danger">{formik.status.error}</Alert>
      )}

      {type === "register" && (
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Input
            name="userName"
            placeholder="Enter your name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.userName}
          />
          {formik.errors.userName && formik.touched.userName && (
            <div style={{ color: "red" }}>{formik.errors.userName}</div>
          )}
        </Form.Group>
      )}
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Input
          name="email"
          placeholder="Enter your email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.errors.email && formik.touched.email && (
          <div style={{ color: "red" }}>{formik.errors.email}</div>
        )}
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Input
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.errors.password && formik.touched.password && (
          <div style={{ color: "red" }}>{formik.errors.password}</div>
        )}
      </Form.Group>
      {type === "register" && (
        <>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Input
              name="passwordConfirmation"
              type="password"
              placeholder="Confirm your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.passwordConfirmation}
            />
            {formik.errors.passwordConfirmation &&
              formik.touched.passwordConfirmation && (
                <div style={{ color: "red" }}>
                  {formik.errors.passwordConfirmation}
                </div>
              )}
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Expense Limit</Form.Label>
            <Input
              name="totalExpenseLimit"
              type="number"
              placeholder="Enter your expense Limit"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.totalExpenseLimit}
            />
            {formik.errors.totalExpenseLimit &&
              formik.touched.totalExpenseLimit && (
                <div style={{ color: "red" }}>
                  {formik.errors.totalExpenseLimit}
                </div>
              )}
          </Form.Group>
        </>
      )}
      <Button
        type="primary"
        className="mt-2"
        htmlType="submit"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? (
          <Spinner animation="border" size="sm" />
        ) : type === "register" ? (
          "Register"
        ) : (
          "Login"
        )}
      </Button>
    </Form>
  );
};
export default AuthForm;
