import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { paths } from "../../Router/Constant";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { expenseListingHandler } from "./action";
import withTableData from "../../components/DataTable/withTableData";
import NoDataFoundTableError from "../../utils/errorMessages";
import { useDispatch } from "react-redux";
import { deleteExpenseHandler } from "./action";
const Expense = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [display] = useState(props.display ? props.display : "Expense Listing");
  const {
    handleSearch,
    handleSort,
    setPage,
    setPageSize,
    pageSize,
    paginationComponentOptions,
  } = props;

  const expenseList = useSelector((state) => state.expense.expenseListing);

  const handleEdit = (row) => {
    navigate(paths.editExpense, { state: row });
  };

  const handleDelete = (id) => {
    const payload = {
      expenseId: id,
    };
    dispatch(deleteExpenseHandler(payload)).then((res) => {
      if (res?.data?.status === 1) {
        try {
          const payload = {
            page: 1,
            pageSize: 12,
          };
          dispatch(expenseListingHandler(payload));
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  const columns = [
    {
      name: "Expense Title",
      selector: (row) => row.title,
      sortable: true,
      grow: 2,
    },
    {
      name: "Expense Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Expense Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Expense Category",
      selector: (row) => row.category?.categoryName,
      sortable: true,
    },
    {
      name: "Expense Added By",
      selector: (row) => row.expenseAddedBy.userName,
    },
    ...(props?.display
      ? []
      : [
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
        ]),
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
          onClick={() => navigate(paths.addExpense)}
        >
          Add Expense
        </Button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Expense Title..."
          onChange={handleSearch}
        />
      </div>

      <DataTable
        title={display}
        data={expenseList?.expenses}
        columns={columns}
        sortable
        onSort={handleSort}
        highlightOnHover
        pagination
        paginationServer
        paginationPerPage={pageSize}
        paginationTotalRows={expenseList?.totalCount}
        paginationRowsPerPageOptions={[12, 20, 50, 100, 200]}
        onChangeRowsPerPage={handlePageSizeChange}
        onChangePage={handlePageChange}
        paginationComponentOptions={paginationComponentOptions}
        noDataComponent={<NoDataFoundTableError name="Expense" />}
      />
    </div>
  );
};
export default withTableData(Expense, expenseListingHandler);
