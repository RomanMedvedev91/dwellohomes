import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Spin, Layout } from "antd";

import { AppHeader, Home, Host, Listing, Listings, Login, NotFound, User, Stripe } from './sections';
import { Viewer } from './lib/types';

import { AppHeaderSkeleton, ErrorBanner } from './lib/components';
import { LOG_IN } from "./lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";

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
      if (data.logIn.token) {
        sessionStorage.setItem('token', data.logIn.token);
      } else {
        sessionStorage.removeItem('token');
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
          <Spin size="large" tip="Launching Dwello Homes" />
        </div>
      </Layout>
    );
  };

  return (
    <BrowserRouter>
      <Layout>
        {error ? (
          <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
        ) : null}
        {/* <Affix offsetTop={0} className="app__affix-header"> */}
          <AppHeader viewer={viewer} setViewer={setViewer} />
        {/* </Affix> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setViewer={setViewer} />} />
          <Route path="/host" element={<Host viewer={viewer} />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/listings/:location?" element={<Listings />} />
          <Route path="/user/:id" element={<User viewer={viewer} setViewer={setViewer} />} />
          <Route path="/stripe" element={<Stripe viewer={viewer} setViewer={setViewer} />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Layout>
      </BrowserRouter>
  );
}

export default App;
