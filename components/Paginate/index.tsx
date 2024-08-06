import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

interface TablePaginateProps {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const TablePaginate: React.FC<TablePaginateProps> = ({
  itemsPerPage,
  totalItems,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = [];
  for (
    let pageNumber = 1;
    pageNumber <= Math.ceil(totalItems / itemsPerPage);
    pageNumber++
  ) {
    pageNumbers.push(pageNumber);
  }

  const paginate = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-between w-full items-center">
      <p className="w-full text-sm text-secondary-700">
        {currentPage * itemsPerPage - (itemsPerPage - 1)}-
        {currentPage * itemsPerPage < totalItems ? currentPage * itemsPerPage : totalItems} of{" "}
        {totalItems} Results
      </p>
      <ul className="flex gap-2 justify-end items-center mt-5 w-full">
        <li
          className={`flex rounded border-[1px] border-secondary-50 text-black px-2 md:px-3 py-1 md:py-2 cursor-pointer text-sm font-body items-center gap-1 ${
            currentPage < 2 ? "invisible" : ""
          }`}
          onClick={previousPage}
        >
          <GrFormPrevious size={16} /> Prev
        </li>
        {pageNumbers.map((pageNumber, index) => (
          <React.Fragment key={index}>
            <li
              key={index}
              className={`md:h-8 md:w-8 text-sm font-body flex justify-center items-center px-2 md:px-3 py-1 md:py-2 rounded-md cursor-pointer ${
                currentPage === pageNumber
                  ? "bg-primary-500 text-white"
                  : "border-[1px] border-secondary-50 text-black"
              }
                            ${
                              currentPage === 1 &&
                              pageNumber >
                                Math.ceil(totalItems / itemsPerPage) - 3
                                ? ""
                                : currentPage === 2 && pageNumber < 5
                                ? ""
                                : currentPage ===
                                    Math.ceil(totalItems / itemsPerPage) &&
                                  pageNumber >
                                    Math.ceil(totalItems / itemsPerPage) - 4
                                ? ""
                                : currentPage ===
                                    Math.ceil(totalItems / itemsPerPage) - 1 &&
                                  pageNumber > currentPage - 3
                                ? ""
                                : (pageNumber > currentPage - 2 &&
                                    pageNumber < currentPage + 2) ||
                                  pageNumber === 1 ||
                                  pageNumber ===
                                    Math.ceil(totalItems / itemsPerPage)
                                ? ""
                                : "hidden"
                            }
                            `}
              onClick={() => paginate(pageNumber)}
            >
              {pageNumber}
            </li>
            {pageNumber === Math.ceil(totalItems / itemsPerPage) - 1 && (
              <div className="h-8 w-8 flex justify-center items-center rounded-md cursor-pointer bg-secondary-50 text_black">
                <BsThreeDots />
              </div>
            )}
          </React.Fragment>
        ))}
        <li
          className={`flex rounded border-[1px] border-secondary-50 text-secondary-600 px-2 md:px-3 py-1 md:py-2 cursor-pointer text-sm items-center gap-1 font-body ${
            currentPage > Math.ceil(totalItems / itemsPerPage) - 3
              ? "invisible"
              : ""
          }`}
          onClick={nextPage}
        >
          Next <GrFormNext size={16} />
        </li>
      </ul>
    </div>
  );
};

export default TablePaginate;
