import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { paths } from "../../Router/Constant";
import { updateCategoryHandler } from "./action";
import CreateCategory from "./CreateCategory";
const EditCategory = () => {
  const location = useLocation();

  const { _id, categoryName, categoryExpenseLimit } = location.state;
  const [category, setCategory] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useMemo(
    () => setCategory({ categoryName, categoryExpenseLimit }),
    [categoryName, categoryExpenseLimit]
  );

  const handleUpdate = async (values) => {
    if (values) {
      const response = await dispatch(
        updateCategoryHandler({
          categoryId: _id,
          categoryName: values.categoryName,
          categoryExpenseLimit: values.categoryExpenseLimit,
        })
      );

      if (response.data.status === 1) {
        navigate(paths.category);
      }
    }
  };

  return (
    <CreateCategory
      initialValues={category}
      onSubmit={handleUpdate}
      editFun="Edit"
    />
  );
};

export default EditCategory;
