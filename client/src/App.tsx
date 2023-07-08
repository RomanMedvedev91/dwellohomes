import React, { useState } from 'react';
import { Layout } from "antd";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import { Home, Host, Listing, Listings, Login, NotFound, User } from './sections';
import { Viewer } from './lib/types';

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
};

function App() {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setViewer={setViewer} />} />
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
