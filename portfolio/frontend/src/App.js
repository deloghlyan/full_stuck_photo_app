import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { client } from "./client";
import { CreatePins, Feed, PinDetails, Search, UserProfile } from "./components";
import Login from "./components/Login";
import Home from "./container/Home";
import Main from "./layouts/Main";
import Pins from "./layouts/Pins"
import { userQuery } from "./utilities/data";
import { fetchUser } from "./utilities/fetchUser";


const App = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("7");
  console.log(searchTerm)

  const userInfo = fetchUser()

  useEffect(() => {
    const query = userQuery(userInfo?.sub);

    client.fetch(query).then((data) => setUser(data[0]));
  }, []);


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Main />} >
        <Route element={<Home user={user} />} >
          <Route path="user-profile/:userId" element={<UserProfile />} />
          <Route path="*" element={<Pins user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}>
            <Route index element={<Feed user={user} />} />
            <Route path="category/:categoryId" element={<Feed />} />
            <Route path="pin-detail/:pinId" element={<PinDetails user={user} />} />
            <Route path="create-pin" element={<CreatePins user={user} />} />
            <Route path="search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          </Route>
        </Route>
  
        <Route path="login" element={<Login />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router} />
  );
};

export default App;
