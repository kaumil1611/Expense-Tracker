import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const withTableData = (WrappedComponent, action) => {
  return (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [sortBy, setSortBy] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    const dispatch = useDispatch();

    const paginationComponentOptions = {
      selectAllRowsItem: true,
      selectAllRowsItemText: "ALL",
    };

    const fetchData = async () => {
      try {
        if (sortDirection) {
          const payload = {
            page,
            pageSize,
            searchField: searchTerm,
            sort: sortDirection,
          };

          await dispatch(action(payload));
        } else {
          const payload = {
            page,
            pageSize,
            searchField: searchTerm,
          };

          const data = await dispatch(action(payload));
        }
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      fetchData();
    }, [page, pageSize, sortBy, sortDirection]);
    useEffect(() => {
      fetchData();
    }, [searchTerm]);

    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleSort = (columnName, sortDir) => {

      if (JSON.stringify(columnName) !== "{}") {
        let data = sortDir === "asc" ? 1 : -1;

        setSortBy(columnName);
        setSortDirection(data);
      }
    };

    return (
      <WrappedComponent
        {...props}
        handleSearch={handleSearch}
        handleSort={handleSort}
        setPage={setPage}
        setPageSize={setPageSize}
        pageSize={pageSize}
        paginationComponentOptions={paginationComponentOptions}
      />
    );
  };
};

export default withTableData;
