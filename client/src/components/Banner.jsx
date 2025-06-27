import React from "react";

const Banner = () => (
  <div className="relative bg-gradient-to-r from-green-500 to-emerald-700 text-white p-8 md:p-12 rounded-xl shadow-lg overflow-hidden my-6 mx-4 md:mx-auto max-w-6xl">
    <div className="absolute inset-0 bg-pattern opacity-10"></div>
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
      <div className="text-center md:text-left mb-6 md:mb-0">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
          Fresh Groceries, Delivered Fast!
        </h2>
        <p className="text-lg md:text-xl opacity-90">
          Get everything you need in minutes, right to your doorstep.
        </p>
      </div>
      <div className="flex-shrink-0">
        <img
          src="https://placehold.co/200x150/F0FDF4/1C6F40?text=Groceries"
          alt="Groceries and Delivery"
          className="w-48 h-auto rounded-lg shadow-md"
        />
      </div>
    </div>
  </div>
);

export default Banner;
