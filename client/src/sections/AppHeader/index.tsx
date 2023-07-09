import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";

import logo from "./assets/dwellohomes-logo.png";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";


interface IAppHeaderProps {
  viewer: Viewer;
  setViewer: (viewer :Viewer)=> void;
}

const { Header } = Layout;

export const AppHeader = ({ viewer, setViewer }: IAppHeaderProps) => {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={logo} alt="App logo" />
          </Link>
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};