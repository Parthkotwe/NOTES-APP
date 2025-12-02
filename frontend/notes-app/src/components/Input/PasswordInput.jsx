import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent border border-gray-400 px-4 rounded-md">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full py-2 text-gray-700 bg-transparent outline-none"
      />

      <div onClick={toggleShowPassword} className="cursor-pointer">
        {isShowPassword ? (
          <FaRegEye size={20} className="text-gray-700" />
        ) : (
          <FaRegEyeSlash size={20} className="text-gray-400" />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
