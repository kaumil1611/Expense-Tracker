import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { paths } from "../../Router/Constant";
import { updateExpenseHandler } from "./action";
import CreateExpense from "./CreateExpense";
const EditExpense = () => {
  const location = useLocation();

  const { _id, title, description, amount, category } = location.state;
  const { _id: value, categoryName: label } = { ...category };

  const categoryData = Object.assign({}, { value, label });


  const [expense, setExpense] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useMemo(
    () => setExpense({ title, description, amount, category: categoryData }),
    [title, description, amount, category]
  );

  const handleUpdate = async (values) => {
    if (values) {
      const response = await dispatch(
        updateExpenseHandler({
          expenseId: _id,
          title: values.title,
          description: values.description,
          amount: values.amount,
          category: values.category.value,
        })
      );

      if (response.data.status === 1) {
        navigate(paths.expense);
      }
    }
  };

  return (
    <CreateExpense
      initialValues={expense}
      onSubmit={handleUpdate}
      editFun="Edit"
    />
  );
};

export default EditExpense;
