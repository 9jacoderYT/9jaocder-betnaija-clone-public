import { Search, Volleyball } from "lucide-react";
import { Input } from "../ui/input";
import { sports } from "../../lib/data/sports";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

const SectionOne = () => {
  const { setSportsId } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter sports based on search term
  const filteredSports = sports.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#272729] p-4 h-full">
      <div className="px-1 bg-[#3d414b] flex flex-row">
        <Input
          type="text"
          placeholder="Search for events, teams, leagues and players"
          title="Search for events, teams, leagues and players"
          className="w-full bg-transparent text-white outline-none border-0 outline-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="h-7 w-7 text-white items-center my-auto" />
      </div>

      <ul className="mt-4">
        {filteredSports.length > 0 ? (
          filteredSports.map((item, index) => (
            <li
              key={index}
              className="flex items-center py-1 text-white hover:text-green-300 cursor-pointer"
              onClick={() => setSportsId({ sports_id: item.key })}
            >
              <span className="mr-1">
                <Volleyball className="h-3 animate-bounce" />
              </span>
              <a
                href="#"
                className="text-xs"
                onClick={(e) => e.preventDefault()}
              >
                {item.title}
              </a>
            </li>
          ))
        ) : (
          <li className="text-white text-xs py-1">No results found</li>
        )}
      </ul>
    </div>
  );
};

export default SectionOne;
