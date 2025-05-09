import { FilterBarProps } from "@/types";
import { categories, statuses } from "../../../shared/schema";
import { ChangeEvent, useState } from "react";
import { Search } from "lucide-react";

const FilterBar = ({ onCategoryChange, onStatusChange, onSearch }: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="md:flex md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative">
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
              onChange={handleStatusChange}
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
