import React, { useState } from 'react';
import { Layout } from "antd";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import { AppHeader, Home, Host, Listing, Listings, Login, NotFound, User } from './sections';
import { Viewer } from './lib/types';
import { Affix } from "antd";

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
        {/* <Affix offsetTop={0} className="app__affix-header"> */}
          <AppHeader viewer={viewer} setViewer={setViewer} />
        {/* </Affix> */}
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
