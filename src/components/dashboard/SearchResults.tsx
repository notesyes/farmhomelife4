"use client";

import { useEffect, useRef } from 'react';
import { useSearch, SearchResult } from '@/components/SearchContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchResults() {
  const { searchQuery, searchResults, isSearching, clearSearch } = useSearch();
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        clearSearch();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clearSearch]);

  // Handle escape key to close search results
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearSearch();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [clearSearch]);

  if (!searchQuery) return null;

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    clearSearch();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'sales':
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'feed':
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'incubation':
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'customer':
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div 
      ref={resultsRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700"
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isSearching ? 'Searching...' : `Search Results (${searchResults.length})`}
        </h3>
        <button 
          onClick={clearSearch}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {isSearching ? (
        <div className="p-4 text-center">
          <svg className="animate-spin h-5 w-5 text-emerald-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching across all data...</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No results found for &ldquo;{searchQuery}&rdquo;</p>
        </div>
      ) : (
        <div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {searchResults.slice(0, 5).map((result) => (
              <li key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <Link href={result.url} className="block" onClick={() => handleResultClick(result)}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getTypeIcon(result.type)}
                        <p className="ml-3 text-sm font-medium text-emerald-600 dark:text-emerald-500 truncate">
                          {result.title}
                        </p>
                      </div>
                      {result.date && (
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            {result.date}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          
          {searchResults.length > 5 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href={`/dashboard/search?q=${encodeURIComponent(searchQuery)}`}
                className="flex justify-center items-center text-sm text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium"
                onClick={() => clearSearch()}
              >
                View all {searchResults.length} results
                <svg className="ml-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}
      
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link 
          href={`/dashboard/search?q=${encodeURIComponent(searchQuery)}`}
          className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 font-medium"
          onClick={clearSearch}
        >
          View all results
        </Link>
      </div>
    </div>
  );
}
