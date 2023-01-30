import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { paths } from "../../Router/Constant";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { categoryListing } from "./action";
import withTableData from "../../components/DataTable/withTableData";
import NoDataFoundTableError from "../../utils/errorMessages";
import { deleteCategoryHandler } from "./action";
const Category = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSearch,
    handleSort,
    setPage,
    setPageSize,
    pageSize,
    paginationComponentOptions,
  } = props;
  // const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.category.categoryListing);

  const handleEdit = (row) => {
    navigate(paths.editCategory, { state: row });
  };

  const handleDelete = (id) => {
    const payload = {
      categoryId: id,
    };
    dispatch(deleteCategoryHandler(payload)).then((res) => {
      if (res?.data?.status === 1) {
        try {
          const payload = {
            page: 1,
            pageSize: 12,
          };
          dispatch(categoryListing(payload));
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  const columns = [
    {
      name: "Category Name",
      selector: (row) => row.categoryName,
      sortable: true,
      grow: 2,
    },
    {
      name: "Category Expense Limit",
      selector: (row) => row.categoryExpenseLimit,
      sortable: true,
    },
    {
      name: "Category Added By",
      selector: (row) => row.categoryAddedBy.userName,
    },
    {
      name: "Edit",
      cell: (row) => (
        <Button variant="primary" onClick={() => handleEdit(row)}>
          Edit
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Delete",
      cell: (row) => (
        <Button variant="danger" onClick={() => handleDelete(row._id)}>
          Delete
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
  };
  return (
    <div>
      <div className="d-flex justify-content-end">
        <Button
          variant="outline-primary"
          onClick={() => navigate(paths.addCategory)}
        >
          Add Category
        </Button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Category..."
          onChange={handleSearch}
        />
      </div>

      <DataTable
        title="Category Listing"
        data={categoryList?.categories}
        columns={columns}
        sortable
        onSort={handleSort}
        highlightOnHover
        pagination
        paginationServer
        paginationPerPage={pageSize}
        paginationTotalRows={categoryList?.totalCount}
        paginationRowsPerPageOptions={[12, 20, 50, 100, 200]}
        onChangeRowsPerPage={handlePageSizeChange}
        onChangePage={handlePageChange}
        paginationComponentOptions={paginationComponentOptions}
        noDataComponent={<NoDataFoundTableError name="Category" />}
      />
    </div>
  );
};
export default withTableData(Category, categoryListing);
