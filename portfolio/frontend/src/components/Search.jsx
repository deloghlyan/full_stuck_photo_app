// import components
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

// import queries and client to work with sanity
import { client } from "../client";
import { feedQuery, searchQuery } from "../utilities/data";

// impoet hooks
import { useState, useEffect } from "react";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  console.log(searchTerm)


  // create a debounce function 
  function debounce(callback, delay = 1000) {
    let timeout

    return (...args) => {
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        callback(...args)
      }, delay)
    }
  }

  // create a loading state so a spinner is shown when shearch results are loading
  const [loading, setLoading] = useState(false);

  // create searching effect which is checking searchTerm changes
  useEffect(() => {
    setLoading(true);
    const debouncedSearch = debounce((searchTerm) => {
      if (searchTerm) {
        
        const query = searchQuery(searchTerm.toLowerCase());
  
        client.fetch(query).then((data) => {
          setPins(data);
          setLoading(false);
        });
      } else {
        client.fetch(feedQuery).then((data) => {
          setPins(data);
          setLoading(false);
        });
      }
    })

    debouncedSearch(searchTerm)

    return () => {
      clearTimeout(debouncedSearch)
    }
    
  }, [searchTerm]);

  return (
    // show the spinner when is loading
    // if there are pins show them in the MasonaryLayout
    // if there are no pins matching the search term write a text
    <div>
      {loading && <Spinner message="Searching for pins..." />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl">No pins found!</div>
      )}
    </div>
  );
};

export default Search;
