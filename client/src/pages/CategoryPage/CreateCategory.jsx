import React, { useState } from "react";
import { Col, Form, Button, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./createCategory.css";
import { addCategoryHandler, updateCategoryHandler } from "./action";
import { useDispatch } from "react-redux";
// import { getItem } from "../../utils/Functions";
import { useNavigate } from "react-router-dom";
import { paths } from "../../Router/Constant";

const CreateCategory = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { initialValues, onSubmit, editFun } = props;

  const formik = useFormik({
    initialValues: initialValues || {
      categoryName: "",
      categoryExpenseLimit: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string().required("Category name is required"),
      categoryExpenseLimit: Yup.number()
        .required("Category expense limit is required")
        .positive("Expense limit must be a positive number"),
    }),
    onSubmit:
      editFun === "Edit"
        ? onSubmit
        : async (values) => {
            if (values) {
              const response = await dispatch(addCategoryHandler(values));
              if (response.status === 1) {
                navigate(paths.category);
              }
            }
          },
  });

  return (
    <div className="create-category-container">
      <div className="panel">
        <div className="panel-header pb-0">
          <h2 className="title">
            {initialValues ? "Edit" : "Create"} Category
          </h2>
        </div>
        <div className="panel-content pb-0">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col xs={12} sm={6} md={4}>
                <div className="user-title-info user-details">
                  <Form.Group controlId="categoryName">
                    <Form.Label>
                      Category Name
                      <span className="text-danger">&nbsp;*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      name="categoryName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.categoryName}
                      isInvalid={
                        formik.touched.categoryName &&
                        formik.errors.categoryName
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.categoryName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <div className="user-title-info user-details">
                  <Form.Group controlId="categoryExpenseLimit">
                    <Form.Label>
                      Category Expense Limit
                      <span className="text-danger"> *</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      className="form-control "
                      name="categoryExpenseLimit"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.categoryExpenseLimit}
                      isInvalid={
                        formik.touched.categoryExpenseLimit &&
                        formik.errors.categoryExpenseLimit
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.categoryExpenseLimit}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </Col>
            </Row>
            <div className="panel-footer pt-2  ">
              <div className="button-group">
                <Button
                  variant="outline-primary"
                  className="mr-3"
                  type="submit"
                >
                  {initialValues ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
