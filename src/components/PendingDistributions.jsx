import React, { useEffect, useState } from "react";
import Button from "./Button";
import Confirmation from "./Confirmation";
import { toast, ToastContainer } from "react-toastify";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { set } from "react-hook-form";

const PendingDistributions = ({
  pendingItems,
  onCancelDistribution,
  isDonorPage,
  onCompleteProp,
  cancelOrder,
  completeOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [isConfirmationOpen, setConfirmationOpen] = React.useState(false);
  const [canceledItemIndex, setCanceledItemIndex] = React.useState(null);
  const [isCompleteConfirmationOpen, setCompleteConfirmationOpen] =
    React.useState(false);
  const [completedItemIndex, setCompletedItemIndex] = React.useState(null);
  const [cancellingItemOrderId, setCancellingItemOrderId] = useState("");
  const [completingItemOrderId, setCompletingItemOrderId] = useState("");
  //visibility on mobile
  const [showDetails, setShowDetails] = useState(false);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const [expandedItemIndex, setExpandedItemIndex] = useState(null);

  useEffect(() => {
    console.log("Pending Items:", pendingItems);
  }, [pendingItems]);

  const openConfirmation = (index) => {
    setCanceledItemIndex(index);
    setConfirmationOpen(true);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages = Math.ceil(pendingItems.length / itemsPerPage);
  const visibleItems = pendingItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredItems = visibleItems.filter((item) => {
    const itemTitle = item.title || (item.order && item.order.title);
    const itemLocation = item.address || (item.order && item.order.address);

    if (!itemTitle || !itemLocation) {
      console.error("Invalid item or item title/location:", item);
      return false;
    }

    return (
      itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      itemLocation.toLowerCase().includes(locationFilter.toLowerCase())
    );
  });

  const sortItems = (option) => {
    if (option === sortOption) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortDirection("asc");
    }
  };

  const sortedItems = filteredItems.sort((a, b) => {
    if (sortOption === "plates") {
      const aPlates = a.order
        ? a.order.foodForNumberOfPeople
        : a.foodForNumberOfPeople;
      const bPlates = b.order
        ? b.order.foodForNumberOfPeople
        : b.foodForNumberOfPeople;
      return sortDirection === "asc" ? aPlates - bPlates : bPlates - aPlates;
    } else if (sortOption === "closingTime") {
      const aClosingTime = a.order ? a.order.closingTime : a.closingTime;
      const bClosingTime = b.order ? b.order.closingTime : b.closingTime;
      return sortDirection === "asc"
        ? aClosingTime - bClosingTime
        : bClosingTime - aClosingTime;
    } else {
      return 0;
    }
  });

  const onConfirmCancel = () => {
    onCancelDistribution(canceledItemIndex);
    toast.warning("Distribution Cancelled");
    closeCancelConfirmation();
    cancelOrder(cancellingItemOrderId);
  };

  const closeCancelConfirmation = () => {
    setCanceledItemIndex(null);
    setConfirmationOpen(false);
  };

  const handleCompleteClick = (index) => {
    setCompletedItemIndex(index);
    setCompleteConfirmationOpen(true);
    completeOrder(completingItemOrderId);
  };

  const onConfirmComplete = () => {
    if (onCompleteProp && completedItemIndex !== null) {
      onCompleteProp(pendingItems[completedItemIndex]);
      toast.success("Distribution Completed");
    }
    setCompleteConfirmationOpen(false);
  };

  const closeCompleteConfirmation = () => {
    setCompletedItemIndex(null);
    setCompleteConfirmationOpen(false);
  };
  const handleSearchTitle = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchLocation = (e) => {
    setLocationFilter(e.target.value);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 dark:text-gray-800">
        Pending Distributions
      </h1>
      <div className="flex items-center mb-4"></div>
      {visibleItems.length === 0 ? (
        <p className="text-gray-500">No pending distributions.</p>
      ) : (
        <div>
          <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Search: 
              </label>
           <div className="grid grid-cols-2 gap-4">
             
            <div>
              
              {/* <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Search by Title
              </label> */}
              <input
                type="text"
                id="title"
                placeholder="Search by Title"
                value={searchTerm}
                onChange={handleSearchTitle}
                className="border border-gray-300 rounded-md py-1 px-2 w-full"
              />
            </div>

            <div>
              {/* <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Search by Location
              </label> */}
              <input
                type="text"
                id="location"
                placeholder="Search by Location"
                value={locationFilter}
                onChange={handleSearchLocation}
                className="border border-gray-300 rounded-md py-1 px-2 w-full"
              />
            </div>
          </div>
        <table className="min-w-full border border-gray-300 shadow-sm">
         

          <thead className="bg-primary dark:bg-primary-dark">
            <tr>
              <th className="py-2 px-4 text-left">Title</th>
              {!isMobile && (
                <>
                  <th className="py-2 px-4 text-left">
                    <button
                      onClick={() => sortItems("plates")}
                      className="focus:outline-none"
                    >
                      Plates{" "}
                      {sortOption === "plates" && sortDirection === "asc" ? (
                        <span>&uarr;</span>
                      ) : (
                        <span>&darr;</span>
                      )}
                    </button>
                  </th>

                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Location</th>

                  <th className="py-2 px-4 text-left">Contact</th>
                </>
              )}
              <th className="py-2 px-4 text-left">
                <button
                  onClick={() => sortItems("closingTime")}
                  className="focus:outline-none"
                >
                  Closing Time{" "}
                  {sortOption === "closingTime" && sortDirection === "asc" ? (
                    <span>&uarr;</span>
                  ) : (
                    <span>&darr;</span>
                  )}
                </button>
              </th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`border-b border-gray-300 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-gray-800 dark:text-gray-200">
                    {item.order ? item.order.title : item.title}
                  </td>
                  {!isMobile && (
                    <>
                      <td className="py-3 px-4 text-right">
                        <span className="bg-blue-400 text-white px-2 py-1 rounded-full text-xs">
                          {item.order
                            ? item.order.foodForNumberOfPeople
                            : item.foodForNumberOfPeople}{" "}
                          Plates
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                        {item.order ? item.order.title : item.title}
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                        {item.order ? item.order.address : item.address}
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                        {item.order ? item.order.contact : item.contact}
                      </td>
                    </>
                  )}
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                    {item.order
                      ? `${item.order.closingTime} hrs`
                      : `${item.closingTime} hrs`}
                  </td>

                  <td className="py-3 px-4 flex space-x-2">
                    {!isMobile && (
                      <>
                        {isDonorPage && (
                          <Button
                            onClick={() => {
                              handleCompleteClick(index);
                              setCompletingItemOrderId(
                                item.order ? item.order._id : item._id
                              );
                            }}
                            variant="complete"
                            text="Complete"
                          />
                        )}
                        <Button
                          onClick={() => {
                            openConfirmation(index);
                            setCancellingItemOrderId(
                              item.order ? item.order._id : item._id
                            );
                          }}
                          variant="cancel"
                          text="Cancel"
                        />
                      </>
                    )}
                    {isMobile && (
                      <Button
                        onClick={() =>
                          setExpandedItemIndex(
                            expandedItemIndex === index ? null : index,
                            setShowDetails(!showDetails)
                          )
                        }
                        variant="details"
                        text={showDetails ? "Hide Details" : "View Details"}
                      />
                    )}
                  </td>
                </tr>
                {expandedItemIndex === index && (
                  <tr>
                    <td colSpan="7">
                      <div className="border border-gray-300 shadow-sm p-4">
                        <p>name: {item.title}</p>
                        <p>plates: {item.foodForNumberOfPeople}</p>
                        <p>location: {item.address}</p>
                        <p>contact: {item.contact}</p>
                      </div>
                      <div>
                        {isDonorPage && (
                          <Button
                            onClick={() => {
                              handleCompleteClick(index);
                              setCompletingItemOrderId(
                                item.order ? item.order._id : item._id
                              );
                            }}
                            variant="complete"
                            text="Complete"
                          />
                        )}
                        <Button
                          onClick={() => {
                            openConfirmation(index);
                            setCancellingItemOrderId(
                              item.order ? item.order._id : item._id
                            );
                          }}
                          variant="cancel"
                          text="Cancel"
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        </div>
      )}
      <div className="mt-4 flex">
        <span className="mr-2 text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      {pendingItems.length > itemsPerPage && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            <IoIosArrowBack />
            <span>Previous Page</span>
          </button>
          <span className="text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
          >
            <span>Next Page</span>
            <IoIosArrowForward />
          </button>
        </div>
      )}
      <Confirmation
        isOpen={isConfirmationOpen}
        onClose={closeCancelConfirmation}
        onConfirm={() => {
          onConfirmCancel();
        }}
        message="Are you sure you want to CANCEL?"
      />
      <Confirmation
        isOpen={isCompleteConfirmationOpen}
        onClose={closeCompleteConfirmation}
        onConfirm={onConfirmComplete}
        message="Is the distribution COMPLETED?"
      />
    </div>
  );
};
export default PendingDistributions;
