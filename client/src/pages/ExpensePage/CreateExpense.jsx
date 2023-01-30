import React, { useState, useEffect } from "react";
import { Col, Form, Button, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
// import { css } from "react-select/src/components/Control";

import "./createExpense.css";
import { addExpenseHandler, categoryListingHandler } from "./action";
import { paths } from "../../Router/Constant";

const CreateExpense = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { initialValues, onSubmit, editFun } = props;

  const [options, setOptions] = useState([]);
  const categoryListData = useSelector(
    (state) => state.expense.expenseCategoryListing
  );

  useEffect(() => {
    dispatch(categoryListingHandler());
    const cOption = categoryListData?.categories?.map((category) => ({
      value: category._id,
      label: category.categoryName,
    }));
    setOptions(cOption);
  }, []);

  const formik = useFormik({
    initialValues: initialValues || {
      title: "",
      description: "",
      amount: 0,
      category: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Expense Title is required"),
      description: Yup.string().required("Description is required"),
      amount: Yup.number()
        .required("Expense Amount is required")
        .positive("Expense Amount must be a positive number"),
      category: Yup.object()
        .shape({
          value: Yup.string().required(),
          label: Yup.string().required(),
        })
        .nullable()
        .required("Category is required"),
    }),
    onSubmit:
      editFun === "Edit"
        ? onSubmit
        : async (values) => {
            if (values) {
              const payload = {
                title: values.title,
                description: values.description,
                amount: values.amount,
                category: values.category.value,
              };
              const response = await dispatch(addExpenseHandler(payload));
              if (response.status === 1) {
                navigate(paths.expense);
              }
            }
          },
  });

  return (
    <div className="create-expense-container">
      <div className="panel">
        <div className="panel-header pb-0">
          <h2 className="title">
            {" "}
            {initialValues ? "Edit" : "Create"} Expense
          </h2>
        </div>
        <div>
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Expense Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Expense Title"
                    name="title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                    isInvalid={formik.touched.title && formik.errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Expense Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Expense Amount"
                    name="amount"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.amount}
                    isInvalid={formik.touched.amount && formik.errors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.amount}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Expense Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    placeholder="Enter Expense Description"
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    isInvalid={
                      formik.touched.description && formik.errors.description
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Expense Category</Form.Label>
                  <Select
                    name="category"
                    isClearable
                    options={options}
                    styles={
                      formik.touched.category && formik.errors.category
                        ? {
                            control: (base) => ({
                              ...base,
                              borderColor: "red",
                            }),
                          }
                        : {}
                    }
                    onInputChange={(inputValue) => {
                      setOptions(
                        options.filter((option) =>
                          option.label
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        )
                      );
                    }}
                    className={
                      formik.touched.category && formik.errors.category
                        ? "category-select-error is-invalid"
                        : ""
                    }
                    onBlur={formik.handleBlur}
                    onChange={(selectedOption) =>
                      formik.setFieldValue("category", selectedOption)
                    }
                    value={formik.values.category}
                    isInvalid={
                      formik.touched.category && formik.errors.category
                    }
                  />

                  {formik.touched.category && formik.errors.category ? (
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.category}
                    </Form.Control.Feedback>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center">
              <Button type="submit" variant="primary">
                {initialValues ? "Update" : "Save"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default CreateExpense;
