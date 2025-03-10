// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Table,
//   TableHead,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
//   Select,
//   MenuItem,
//   IconButton,
//   InputLabel,
//   FormControl,
//   Box,
//   Typography,
// } from "@mui/material";
// import {
//   ChevronLeft as ChevronLeftIcon,
//   ChevronRight as ChevronRightIcon,
// } from "@mui/icons-material";

// const MyTable = ({
//   columns,
//   data,
//   filterColumns,
//   showDate = true,
//   entryText = "Total no. of entries : ",
// }) => {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterValues, setFilterValues] = useState({});
//   const [pageLimit, setPageLimit] = useState(10);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const nextPage = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
//   const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

//   const handleFilterChange = (column, event) => {
//     const { value } = event.target;
//     setFilterValues((prevFilters) => ({
//       ...prevFilters,
//       [column.accessor]: value === "" ? undefined : value,
//     }));
//   };

//   useEffect(() => {
//     setCurrentPage(0);
//   }, [searchQuery, pageLimit, fromDate, toDate]);

//   const filteredData = useMemo(() => {
//     if (!data) return [];

//     return data
//       .filter((row) =>
//         Object.entries(row).some(([key, value]) => {
//           if (typeof value === "string") {
//             return value.toLowerCase().includes(searchQuery.toLowerCase());
//           } else if (typeof value === "number") {
//             return value.toString().includes(searchQuery);
//           }
//           return false;
//         })
//       )
//       .filter((row) =>
//         Object.entries(filterValues).every(([key, value]) => {
//           if (value === undefined) return true;
//           const rowValue = row[key];
//           return rowValue === (isNaN(value) ? value : Number(value));
//         })
//       )
//       .filter((row) => {
//         if (fromDate && toDate) {
//           const createdAt = new Date(row.updatedAt);
//           const toDateWithTime = new Date(toDate);
//           toDateWithTime.setHours(23, 59, 59, 999);
//           return createdAt >= new Date(fromDate) && createdAt <= toDateWithTime;
//         }
//         return true;
//       });
//   }, [data, searchQuery, filterValues, fromDate, toDate]);

//   const getDistinctValues = (accessor) => [
//     ...new Set(data.map((row) => row[accessor])),
//   ];

//   const shouldHaveSelectFilter = (column) =>
//     filterColumns &&
//     filterColumns.includes(column.accessor) &&
//     getDistinctValues(column.accessor).length >= 2;

//   const handlePageLimitChange = (event) => {
//     const newLimit = parseInt(event.target.value, 10);
//     setPageLimit(newLimit);
//     setCurrentPage((prevPage) =>
//       Math.min(prevPage, Math.ceil(filteredData.length / newLimit) - 1)
//     );
//   };

//   const totalPages = Math.ceil(filteredData.length / pageLimit);

//   return (
//     <Box px={3}>
//       <TableContainer
//         sx={{
//           borderRadius: "8px",
//           border: "1px solid #E0E0E0",
//           overflow: "hidden",
//           boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//           // maxWidth: "100%",
//           overflowX: "auto",
//         }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow>
//               {columns.map((column, index) => (
//                 <TableCell
//                   className="font-Open dark:text-black"
//                   key={index}
//                   sx={{
//                     backgroundColor: "#F9FAFB",
//                     color: "#6B7280",
//                     fontWeight: "bold",
//                     textAlign: "left",
//                     padding: "12px",
//                     border: "1px solid #E0E0E0",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {column.Header}
//                   {shouldHaveSelectFilter(column) && (
//                     <FormControl fullWidth size="small" margin="dense">
//                       <InputLabel className="font-Open dark:text-black">
//                         Filter by {column.Header}
//                       </InputLabel>
//                       <Select
//                         value={filterValues[column.accessor] || ""}
//                         onChange={(event) => handleFilterChange(column, event)}
//                       >
//                         <MenuItem value="">All</MenuItem>
//                         {getDistinctValues(column.accessor).map(
//                           (value, index) => (
//                             <MenuItem key={index} value={value}>
//                               {typeof value === "string"
//                                 ? value
//                                 : Number(value)}
//                             </MenuItem>
//                           )
//                         )}
//                       </Select>
//                     </FormControl>
//                   )}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredData
//               .slice(currentPage * pageLimit, (currentPage + 1) * pageLimit)
//               .map((row, rowIndex) => (
//                 <TableRow key={rowIndex} hover>
//                   {columns.map((column, columnIndex) => (
//                     <TableCell
//                       className="font-Open dark:text-white"
//                       key={columnIndex}
//                       sx={{
//                         padding: "12px",
//                         borderBottom: "1px solid #E0E0E0",
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         alignSelf: "center",
//                         color:
//                           column.accessor === "status"
//                             ? row[column.accessor] === "Failed"
//                               ? "#E53E3E"
//                               : row[column.accessor] === "Successful"
//                               ? "#38A169"
//                               : "#D69E2E"
//                             : "inherit",
//                         fontWeight:
//                           column.accessor === "status" ? "bold" : "normal",
//                         // backgroundColor:
//                         //   column.accessor === "status"
//                         //     ? row[column.accessor] === "Failed"
//                         //       ? "#FEE2E2"
//                         //       : row[column.accessor] === "Successful"
//                         //       ? "#C6F6D5"
//                         //       : "#FEFCBF"
//                         //     : "transparent",
//                         // borderRadius:
//                         //   column.accessor === "status" ? "24px" : "0",
//                       }}
//                     >
//                       {column.render
//                         ? column.render(row)
//                         : row[column.accessor] || "-"}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Box
//         className="font-Open dark:text-white"
//         display="flex"
//         justifyContent="flex-end"
//         alignItems="center"
//         mt={2}
//       >
//         <IconButton
//           onClick={prevPage}
//           disabled={currentPage === 0}
//           color="primary"
//         >
//           <ChevronLeftIcon />
//         </IconButton>
//         <Typography
//           className="font-Open dark:text-white"
//           variant="body2"
//           color="textSecondary"
//           mx={2}
//         >
//           {currentPage + 1} of {totalPages}
//         </Typography>
//         <IconButton
//           onClick={nextPage}
//           disabled={currentPage + 1 >= totalPages}
//           color="primary"
//         >
//           <ChevronRightIcon />
//         </IconButton>
//         <FormControl
//           variant="outlined"
//           size="small"
//           margin="dense"
//           sx={{ ml: 2 }}
//           className="font-Open dark:outline-white"
//         >
//           <Select
//             className="font-Open dark:text-white"
//             value={pageLimit}
//             onChange={handlePageLimitChange}
//           >
//             <MenuItem className="font-Open dark:text-black" value={5}>
//               5
//             </MenuItem>
//             <MenuItem className="font-Open dark:text-black" value={10}>
//               10
//             </MenuItem>
//             <MenuItem className="font-Open dark:text-black" value={50}>
//               50
//             </MenuItem>
//           </Select>
//         </FormControl>
//       </Box>
//     </Box>
//   );
// };

// export default MyTable;

import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Checkbox,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

const MyTable = ({
  columns,
  data,
  filterColumns,
  showDate = true,
  entryText = "Total no. of entries : ",
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [pageLimit, setPageLimit] = useState(10);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set()); // Track selected rows by their unique identifier

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const handleFilterChange = (column, event) => {
    const { value } = event.target;
    setFilterValues((prevFilters) => ({
      ...prevFilters,
      [column.accessor]: value === "" ? undefined : value,
    }));
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, pageLimit, fromDate, toDate]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data
      .filter((row) =>
        Object.entries(row).some(([key, value]) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (typeof value === "number") {
            return value.toString().includes(searchQuery);
          }
          return false;
        })
      )
      .filter((row) =>
        Object.entries(filterValues).every(([key, value]) => {
          if (value === undefined) return true;
          const rowValue = row[key];
          return rowValue === (isNaN(value) ? value : Number(value));
        })
      )
      .filter((row) => {
        if (fromDate && toDate) {
          const createdAt = new Date(row.updatedAt);
          const toDateWithTime = new Date(toDate);
          toDateWithTime.setHours(23, 59, 59, 999);
          return createdAt >= new Date(fromDate) && createdAt <= toDateWithTime;
        }
        return true;
      });
  }, [data, searchQuery, filterValues, fromDate, toDate]);

  const getDistinctValues = (accessor) => [
    ...new Set(data.map((row) => row[accessor])),
  ];

  const shouldHaveSelectFilter = (column) =>
    filterColumns &&
    filterColumns.includes(column.accessor) &&
    getDistinctValues(column.accessor).length >= 2;

  const handlePageLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setPageLimit(newLimit);
    setCurrentPage((prevPage) =>
      Math.min(prevPage, Math.ceil(filteredData.length / newLimit) - 1)
    );
  };

  const totalPages = Math.ceil(filteredData.length / pageLimit);

  const handleCheckboxChange = (rowId) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(rowId)) {
        newSelectedRows.delete(rowId); // Unselect the row if already selected
      } else {
        newSelectedRows.add(rowId); // Select the row
      }
      return newSelectedRows;
    });
  };

  return (
    <Box px={3}>
      <TableContainer
        sx={{
          borderRadius: "8px",
          border: "1px solid #E0E0E0",
          overflow: "hidden",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {/* Add Checkbox Column Header */}
              <TableCell sx={{ width: "40px", padding: "12px" }}>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Select all rows
                      const allRowIds = filteredData.map((row) => row._id);
                      setSelectedRows(new Set(allRowIds));
                    } else {
                      // Deselect all rows
                      setSelectedRows(new Set());
                    }
                  }}
                />
              </TableCell>
              {columns.map((column, index) => (
                <TableCell
                  className="font-Open dark:text-black"
                  key={index}
                  sx={{
                    backgroundColor: "#F9FAFB",
                    color: "#6B7280",
                    fontWeight: "bold",
                    textAlign: "left",
                    padding: "12px",
                    border: "1px solid #E0E0E0",
                    whiteSpace: "nowrap",
                  }}
                >
                  {column.Header}
                  {shouldHaveSelectFilter(column) && (
                    <FormControl fullWidth size="small" margin="dense">
                      <InputLabel className="font-Open dark:text-black">
                        Filter by {column.Header}
                      </InputLabel>
                      <Select
                        value={filterValues[column.accessor] || ""}
                        onChange={(event) => handleFilterChange(column, event)}
                      >
                        <MenuItem value="">All</MenuItem>
                        {getDistinctValues(column.accessor).map(
                          (value, index) => (
                            <MenuItem key={index} value={value}>
                              {typeof value === "string"
                                ? value
                                : Number(value)}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(currentPage * pageLimit, (currentPage + 1) * pageLimit)
              .map((row, rowIndex) => (
                <TableRow key={rowIndex} hover>
                  {/* Add Checkbox for each row */}
                  <TableCell
                    className="dark:text-white"
                    sx={{ padding: "12px" }}
                  >
                    <Checkbox
                      checked={selectedRows.has(row._id)}
                      onChange={() => handleCheckboxChange(row._id)}
                      sx={{
                        "&.MuiCheckbox-root": {
                          borderColor: "white",
                          background: "white",
                        },
                        "& .MuiCheckbox-indicator": {
                          borderColor: "black",
                        },
                        "&.Mui-checked": {
                          color: "black",
                          background: "white",
                        },
                      }}
                    />
                  </TableCell>

                  {columns.map((column, columnIndex) => (
                    <TableCell
                      className="font-Open dark:text-white"
                      key={columnIndex}
                      sx={{
                        padding: "12px",
                        borderBottom: "1px solid #E0E0E0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        alignSelf: "center",
                        color:
                          column.accessor === "status"
                            ? row[column.accessor] === "Failed"
                              ? "#E53E3E"
                              : row[column.accessor] === "Successful"
                              ? "#38A169"
                              : "#D69E2E"
                            : "inherit",
                        fontWeight:
                          column.accessor === "status" ? "bold" : "normal",
                      }}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.accessor] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        className="font-Open dark:text-white"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        mt={2}
      >
        <IconButton
          onClick={prevPage}
          disabled={currentPage === 0}
          color="primary"
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography
          className="font-Open dark:text-white"
          variant="body2"
          color="textSecondary"
          mx={2}
        >
          {currentPage + 1} of {totalPages}
        </Typography>
        <IconButton
          onClick={nextPage}
          disabled={currentPage + 1 >= totalPages}
          color="primary"
        >
          <ChevronRightIcon />
        </IconButton>
        <FormControl
          variant="outlined"
          size="small"
          margin="dense"
          sx={{ ml: 2 }}
          className="font-Open dark:outline-white"
        >
          <Select
            className="font-Open dark:text-white"
            value={pageLimit}
            onChange={handlePageLimitChange}
          >
            <MenuItem className="font-Open dark:text-black" value={5}>
              5
            </MenuItem>
            <MenuItem className="font-Open dark:text-black" value={10}>
              10
            </MenuItem>
            <MenuItem className="font-Open dark:text-black" value={50}>
              50
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default MyTable;
