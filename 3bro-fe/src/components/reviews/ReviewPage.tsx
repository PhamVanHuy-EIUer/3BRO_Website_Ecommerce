import React, { useEffect, useRef, useState } from "react";

import Stars from "../products/Stars";
import { formatDate } from "@/utils/date";
import { Review } from "@/models/Review";

interface star {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
}
const ReviewPage = ({
  data,
  reviewCount,
  productID,
  currentPage,
  totalPages,
  onPageChange,
}: {
  productID: string;
  data: Review[];
  reviewCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const [one, setone] = useState(0);
  const [two, settwo] = useState(0);
  const [three, setthree] = useState(0);
  const [four, setfour] = useState(0);
  const [five, setfive] = useState(0);

  let stars: any = { one: 0, two: 0, three: 0, four: 0, five: 0 };
  function addStars(num: number) {
    if (num < 2) {
      stars.one++;
    } else if (num < 3) {
      stars.two++;
    } else if (num < 4) {
      stars.three++;
    } else if (num < 5) {
      stars.four++;
    } else {
      stars.five++;
    }
  }
  function varAssign(variable: string, number: number) {
    switch (variable) {
      case "one":
        setone(number);
        break;
      case "two":
        settwo(number);
        break;
      case "three":
        setthree(number);
        break;
      case "four":
        setfour(number);
        break;
      case "five":
        setfive(number);
        break;
    }
  }
  async function Calculate() {
    if (reviewCount > 0) {
      await data.map((each) => addStars(each.rating));
      const sumTotal = Object.keys(stars).reduce((previous, key) => {
        return previous + stars[key];
      }, 0);
      Object.keys(stars).forEach(function (key) {
        varAssign(key, Math.round((stars[key] * 100) / sumTotal));
      });
    }
  }
  useEffect(() => {
    Calculate();
  }, [data]);

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">
        <div className="">
          <h2 className="font-manrope font-bold text-xl sm:text-2xl leading-10 text-black mb-8 text-center">
            Customer reviews & rating
          </h2>
          <div className="grid grid-cols-12 mb-11">
            <div className="col-span-12 xl:col-span-4 flex items-center">
              <div className="box flex flex-col gap-y-4 w-full max-xl:max-w-3xl mx-auto">
                <div className="flex items-center w-full">
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    5
                  </p>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_12042_8589)">
                      <path
                        d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                        fill="#FBBF24"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_12042_8589">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className="h-2 w-full sm:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                    <span
                      style={{
                        height: "100%",
                        width: `${five}%`,
                        borderRadius: "30px",
                        backgroundColor:
                          "rgb(99 102 241 / var(--tw-bg-opacity))",
                        display: "flex",
                      }}
                    ></span>
                  </p>
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    30
                  </p>
                </div>
                <div className="flex items-center w-full">
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    4
                  </p>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_12042_8589)">
                      <path
                        d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                        fill="#FBBF24"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_12042_8589">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className="h-2 w-full sm:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                    <span
                      style={{
                        height: "100%",
                        width: `${four}%`,
                        borderRadius: "30px",
                        backgroundColor:
                          "rgb(99 102 241 / var(--tw-bg-opacity))",
                        display: "flex",
                      }}
                    ></span>
                  </p>
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    30
                  </p>
                </div>
                <div className="flex items-center w-full">
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    3
                  </p>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_12042_8589)">
                      <path
                        d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                        fill="#FBBF24"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_12042_8589">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className="h-2 w-full sm:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                    <span
                      style={{
                        height: "100%",
                        width: `${three}%`,
                        borderRadius: "30px",
                        backgroundColor:
                          "rgb(99 102 241 / var(--tw-bg-opacity))",
                        display: "flex",
                      }}
                    ></span>
                  </p>
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    30
                  </p>
                </div>
                <div className="flex items-center w-full">
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    2
                  </p>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_12042_8589)">
                      <path
                        d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                        fill="#FBBF24"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_12042_8589">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className="h-2 w-full sm:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                    <span
                      style={{
                        height: "100%",
                        width: `${two}%`,
                        borderRadius: "30px",
                        backgroundColor:
                          "rgb(99 102 241 / var(--tw-bg-opacity))",
                        display: "flex",
                      }}
                    ></span>
                  </p>
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    30
                  </p>
                </div>
                <div className="flex items-center w-full">
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    1
                  </p>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_12042_8589)">
                      <path
                        d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                        fill="#FBBF24"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_12042_8589">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p className="h-2 w-full sm:min-w-[278px] rounded-[30px] bg-gray-200 ml-5 mr-3">
                    <span
                      style={{
                        height: "100%",
                        width: `${one}%`,
                        borderRadius: "30px",
                        backgroundColor:
                          "rgb(99 102 241 / var(--tw-bg-opacity))",
                        display: "flex",
                      }}
                    ></span>
                  </p>
                  <p className="font-medium text-lg py-[1px] text-black mr-[2px]">
                    30
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-12 xl:col-span-8 xl:pl-8 w-full">
              <div className="grid grid-cols-12 h-full px-8 max-lg:py-8 rounded-3xl bg-gray-100 w-full max-xl:max-w-3xl max-xl:mx-auto">
                <div className="col-span-12 md:col-span-8 flex items-center">
                  <div className="flex flex-col sm:flex-row items-center max-lg:justify-center w-full h-full">
                    <div className="sm:pr-3 sm:border-r border-gray-200 flex items-center justify-center flex-col">
                      <h2 className="font-manrope font-bold text-4xl text-black text-center mb-4">
                        {data.length > 0 ? data[0].rating : 0}
                      </h2>
                      <div className="flex items-center gap-3 mb-4">
                        <Stars
                          size={40}
                          stars={data.length > 0 ? data[0].rating : 0}
                        />
                      </div>
                      <p className="font-normal leading-8 text-gray-400">
                        {reviewCount} Ratings
                      </p>
                    </div>

                    <div className="sm:pl-3 sm:border-l border-gray-200 flex items-center justify-center flex-col">
                      <h2 className="font-manrope font-bold text-4xl text-black text-center mb-4">
                        {data.length > 0 ? data[0].rating : 0}
                      </h2>
                      <div className="flex items-center gap-3 mb-4">
                        <Stars
                          size={40}
                          stars={data.length > 0 ? data[0].rating : 0}
                        />
                      </div>
                      <p className="font-normal leading-8 text-gray-400">
                        Last Review
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Section */}
          <div className="mt-16 max-xl:max-w-3xl max-xl:mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12">
              <div className="pb-8 border-b border-gray-200 max-xl:max-w-3xl max-xl:mx-auto">
                <h4 className="font-manrope font-semibold text-2xl leading-10 text-black mb-6">
                  Recent Reviews
                </h4>
                <div className="flex flex-col gap-5">
                  {data.map((each, index) => (
                    <div
                      className="border-[1px] px-4 rounded-xl py-4"
                      key={index}
                    >
                      <div className="flex sm:items-center flex-col sm:flex-row justify-between  mb-4">
                        <div className="flex gap-3 flex-col">
                          <Stars stars={each.rating} size={40} />

                          <p className="text-xl font-medium">{each.comment}</p>
                        </div>
                        <div className="flex items-end gap-3 flex-col">
                          <p className="font-medium text-base leading-7 text-gray-400">
                            {formatDate(each.reviewDate)}
                          </p>
                          <h6 className="font-semibold text-lg leading-8 text-black">
                            @{each.reviewName}
                          </h6>
                        </div>
                      </div>

                      <p className="font-normal text-lg leading-8 text-gray-500 ">
                        {each.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Component */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 max-xl:max-w-3xl max-xl:mx-auto gap-4">
                  <div className="text-sm text-gray-700">
                    Showing page{" "}
                    <span className="font-semibold">{currentPage}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white"
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {getPageNumbers().map((pageNum, index) => {
                        if (pageNum === "...") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-3 py-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum as number)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                              currentPage === pageNum
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewPage;
