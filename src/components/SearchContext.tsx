"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  performSearch: (query: string) => void;
  isSearching: boolean;
  clearSearch: () => void;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'inventory' | 'sales' | 'feed' | 'incubation' | 'customer' | 'settings';
  url: string;
  date?: string;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Function to search across all data in the application
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Get data from localStorage
    const searchableData = {
      inventory: getInventoryItems(),
      sales: getSalesData(),
      feed: getFeedData(),
      incubation: getIncubationData(),
      customers: getCustomerData()
    };
    
    // Perform the search
    const results: SearchResult[] = [];
    
    // Search inventory
    searchableData.inventory.forEach((item: InventoryItem) => {
      if (matchesSearch(item, query)) {
        results.push({
          id: `inventory-${item.id}`,
          title: item.name,
          description: `Quantity: ${item.quantity} - ${item.category}`,
          type: 'inventory',
          url: '/dashboard/inventory',
          date: new Date(item.lastUpdated).toLocaleDateString()
        });
      }
    });
    
    // Search sales
    searchableData.sales.forEach((sale: SaleItem) => {
      if (matchesSearch(sale, query)) {
        results.push({
          id: `sale-${sale.id}`,
          title: `Sale #${sale.id}`,
          description: `${sale.customerName} - $${sale.amount.toFixed(2)}`,
          type: 'sales',
          url: '/dashboard/sales',
          date: new Date(sale.date).toLocaleDateString()
        });
      }
    });
    
    // Search feed
    searchableData.feed.forEach((feed: FeedItem) => {
      if (matchesSearch(feed, query)) {
        results.push({
          id: `feed-${feed.id}`,
          title: `${feed.brand} ${feed.type}`,
          description: `Quantity: ${feed.quantity}lbs - $${feed.cost.toFixed(2)}`,
          type: 'feed',
          url: '/dashboard/feed',
          date: new Date(feed.date).toLocaleDateString()
        });
      }
    });
    
    // Search incubation
    searchableData.incubation.forEach((batch: IncubationBatch) => {
      if (matchesSearch(batch, query)) {
        results.push({
          id: `incubation-${batch.id}`,
          title: `${batch.species} - ${batch.breed}`,
          description: `${batch.quantity} eggs - Day ${batch.currentDay} of incubation`,
          type: 'incubation',
          url: '/dashboard/incubation',
          date: new Date(batch.startDate).toLocaleDateString()
        });
      }
    });
    
    // Search customers
    searchableData.customers.forEach((customer: Customer) => {
      if (matchesSearch(customer, query)) {
        results.push({
          id: `customer-${customer.id}`,
          title: customer.name,
          description: `${customer.email} - ${customer.phone}`,
          type: 'customer',
          url: '/dashboard/customers',
        });
      }
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Define interfaces for data types
  interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    category: string;
    lastUpdated: string;
    [key: string]: any;
  }

  interface SaleItem {
    id: string;
    customerName: string;
    amount: number;
    date: string;
    [key: string]: any;
  }

  interface FeedItem {
    id: string;
    brand: string;
    type: string;
    quantity: number;
    cost: number;
    date: string;
    [key: string]: any;
  }

  interface IncubationBatch {
    id: string;
    species: string;
    breed: string;
    quantity: number;
    startDate: string;
    currentDay: number;
    [key: string]: any;
  }

  interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    [key: string]: any;
  }

  // Helper function to check if an object matches the search query
  const matchesSearch = <T extends Record<string, any>>(obj: T, query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    return Object.values(obj).some(value => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerQuery);
      }
      if (typeof value === 'number') {
        return value.toString().includes(lowerQuery);
      }
      return false;
    });
  };

  // Helper functions to get data from localStorage
  const getInventoryItems = () => {
    try {
      const items = localStorage.getItem('inventoryItems');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error retrieving inventory items:', error);
      return [];
    }
  };

  const getSalesData = () => {
    try {
      const sales = localStorage.getItem('sales');
      return sales ? JSON.parse(sales) : [];
    } catch (error) {
      console.error('Error retrieving sales data:', error);
      return [];
    }
  };

  const getFeedData = () => {
    try {
      const feedPurchases = localStorage.getItem('feedPurchases');
      return feedPurchases ? JSON.parse(feedPurchases) : [];
    } catch (error) {
      console.error('Error retrieving feed data:', error);
      return [];
    }
  };

  const getIncubationData = () => {
    try {
      const batches = localStorage.getItem('incubationBatches');
      return batches ? JSON.parse(batches) : [];
    } catch (error) {
      console.error('Error retrieving incubation data:', error);
      return [];
    }
  };

  const getCustomerData = () => {
    try {
      const customers = localStorage.getItem('customers');
      return customers ? JSON.parse(customers) : [];
    } catch (error) {
      console.error('Error retrieving customer data:', error);
      return [];
    }
  };

  return (
    <SearchContext.Provider 
      value={{ 
        searchQuery, 
        setSearchQuery, 
        searchResults, 
        performSearch, 
        isSearching, 
        clearSearch 
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
