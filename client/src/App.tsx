import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import { AppHeader, Home, Host, Listing, Listings, Login, NotFound, User } from './sections';
import { Viewer } from './lib/types';
import { Spin, Layout } from "antd";

import { AppHeaderSkeleton, ErrorBanner } from './lib/components';
import { LOG_IN } from "./lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { useMutation } from '@apollo/client';

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
};

function App() {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: data => {
      if (data && data.logIn) {
        setViewer(data.logIn);
      }
    }
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Tinyhouse" />
        </div>
      </Layout>
    );
  };

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

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
