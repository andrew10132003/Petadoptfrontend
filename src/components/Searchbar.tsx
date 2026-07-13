type SearchbarProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

function Searchbar({ search, setSearch }: SearchbarProps) {
  return (
    <div className="max-w-4xl mx-auto mb-10 px-5 mt-10">
      <input
        type="text"
        placeholder="Search pets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-500 rounded-lg p-4 text-lg outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-300 ease-in-out hover:shadow-md"
      />
    </div>
  );
}

export default Searchbar;