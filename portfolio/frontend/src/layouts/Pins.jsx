import { Outlet } from "react-router-dom";
import { Navbar } from "../components";

const Pins = ({ user, searchTerm, setSearchTerm }) => {

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className="h-full">
        <Outlet
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default Pins;
