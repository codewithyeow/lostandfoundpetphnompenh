import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function EnhancedSearchInput() {
    const [searchValue, setSearchValue] = useState('');

    const handleClear = () => {
        setSearchValue('');
    };

    return (
        <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="relative flex flex-col sm:flex-row items-center max-w-[90rem] mx-auto w-full gap-3 sm:gap-4">
                <div className="relative flex items-center w-full">
                    {/* Search Icon */}
                    <Search 
                        className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    
                    {/* Search Input */}
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search for Pet..."
                        className="w-full h-12 pl-12 pr-12 text-base bg-white border-2 border-gray-200 rounded-full 
                                 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                                 transition-all duration-200 ease-in-out
                                 placeholder:text-gray-400
                                 min-w-[300px]"
                    />

                    {/* Clear Button */}
                    {searchValue && (
                        <button
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                                     hover:text-gray-600 transition-colors duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Search Button */}
                <button 
                    className="w-full sm:w-auto px-8 h-12 bg-blue-600 text-white font-medium rounded-full
                             hover:bg-blue-700 active:bg-blue-800 
                             transition-all duration-200 ease-in-out
                             shadow-lg shadow-blue-500/20
                             flex items-center justify-center"
                >
                    Search
                </button>
            </div>
        </div>
    );
}