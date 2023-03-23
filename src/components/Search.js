const Search = () => {
  return (
    <header>
      <div className="flex justify-center mt-20">
        <h2 className="text-xl">Search it. Explore it. Buy it.</h2>
      </div>
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 w-5/12 mx-auto mt-10 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Enter an address, neighborhood, city, or ZIP code"
      />
    </header>
  );
};

export default Search;
