import { useState, useEffect } from 'react';

export function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const useSearch = (model) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState(model);
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filterdData = model.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filterdData);
  };
  useEffect(() => {
    setRows(model);
  }, [model]);
  return {
    searchText,
    requestSearch,
    setSearchText,
    rows,
  };
};

export default useSearch;
