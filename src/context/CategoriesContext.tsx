import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define category type
type Category = {
  value: string;
  label: string;
};

// Initial categories
const CATEGORIES: Category[] = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'cloud-computing', label: 'Cloud Computing' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'ux-design', label: 'UX Design' },
  { value: 'digital-marketing', label: 'Digital Marketing' }
];

// Context type
type CategoriesContextType = {
  categories: Category[];
  userCategories: string[];
  setUserCategories: (categories: string[]) => void;
};

// Create context
const CategoriesContext = createContext<CategoriesContextType>({
  categories: CATEGORIES,
  userCategories: [],
  setUserCategories: () => {}
});

// Provider component
export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userCategories, setUserCategories] = useState<string[]>([]);

  return (
    <CategoriesContext.Provider 
      value={{ 
        categories: CATEGORIES, 
        userCategories, 
        setUserCategories 
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

// Custom hook for using categories
export const useCategories = () => useContext(CategoriesContext);