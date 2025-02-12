import React from "react";

const VerifyForm = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-teal-300 w-full max-w-lg">
      <h2 className="text-xl font-semibold text-gray-900">Enter their information</h2>
      <div className="mt-4">
        <label className="text-gray-700">Certificate number</label>
        <input
          type="text"
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="12 digit alphanumeric string"
        />
      </div>
      <div className="mt-4">
        <label className="text-gray-700">Worker email</label>
        <input
          type="email"
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="Email"
        />
      </div>
      <button className="w-full mt-4 bg-teal-500 text-white py-2 rounded-md">Check</button>

      {/* OR Separator */}
      <div className="flex items-center my-6">
        <hr className="flex-1 border-gray-300" />
        <span className="px-2 text-gray-500">Or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Upload Section */}
      <h2 className="text-xl font-semibold text-gray-900">Upload their certificate</h2>
      <div className="border-dashed border-2 border-teal-300 p-4 mt-4 rounded-md bg-[#F0FFFA]">
        <input type="file" className="w-full" />
      </div>
      <button className="w-full mt-4 bg-teal-500 text-white py-2 rounded-md">Check</button>
    </div>
  );
};

export default VerifyForm;
