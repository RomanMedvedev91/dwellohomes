import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Home, Host, Listing, Listings, Login, NotFound, User } from './sections';
import { Layout } from "antd";

function App() {
  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/host" element={<Host />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/listings/:location?" element={<Listings title="Welcome to Dwello Homes" />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Layout>
    </BrowserRouter>
  );
}

export default App;
