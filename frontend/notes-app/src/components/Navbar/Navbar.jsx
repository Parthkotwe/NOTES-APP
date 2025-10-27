import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, onSearch, searchQuery }) => {
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    onSearch(localSearch);
  };

  const onClearSearch = () => {
    setLocalSearch("");
    onSearch("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-blue-500 py-2">Notes</h2>

      <SearchBar
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
