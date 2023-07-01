import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Home, Host, Listing, Listings, NotFound, User } from './sections';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/host" element={<Host />} />
      <Route path="/listing/:id" element={<Listing />} />
      <Route path="/listings/:location?" element={<Listings title="Welcome to Dwello Homes" />} />
      <Route path="/user/:id" element={<User />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
