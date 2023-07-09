
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, Menu } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Viewer } from "../../../../lib/types";
import { LOG_OUT } from "../../../../lib/graphql/mutations";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { useMutation } from "@apollo/client";
import { displayErrorMessage, displaySuccessNotification } from "../../../../lib/utils";

const { Item, SubMenu } = Menu;

interface IMenuItemsProps {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: IMenuItemsProps) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: data => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        displaySuccessNotification("You've successfully logged out!");
      }
    },
    onError: () => {
      displayErrorMessage("Sorry! We weren't able to logout. Please try again later!");
    }
  });

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined />
          Host
        </Link>
      </Item>
      {viewer.id && viewer.avatar ? (
        <SubMenu title={<Avatar src={viewer.avatar} />}>
          <Item key="/user">
            <Link to={`/user/${viewer.id}`}>
              <UserOutlined />
              Profile
            </Link>
          </Item>
          <Item key="/logout">
            <LogoutOutlined onClick={() => logOut()}/>
            Log out
          </Item>
        </SubMenu>
        ) : (
          <Item>
            <Link to="/login">
              <Button type="primary">Sign In</Button>
            </Link>
        </Item>
        )}
    </Menu>
  );
};