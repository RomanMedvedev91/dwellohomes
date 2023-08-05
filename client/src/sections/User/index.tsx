import React, { useState } from 'react'
import { useQuery } from "@apollo/client";
import { useParams } from 'react-router-dom';
import { Col, Layout, Row } from "antd";

import { USER } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables
} from "../../lib/graphql/queries/User/__generated__/User";
import { Viewer } from '../../lib/types';
import { ErrorBanner, PageSkeleton } from '../../lib/components';
import { UserBookings, UserListings, UserProfile } from "./components";

const PAGE_LIMIT = 4;
const { Content } = Layout;

interface IUserProps {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}
export const User = ({ viewer, setViewer }: IUserProps) => {
  const { id } = useParams();
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(USER, {
    variables: id ? {
      id,
      bookingsPage,
      listingsPage,
      limit: PAGE_LIMIT
    } : undefined
  });

  const handleUserRefetch = async () => {
    await refetch();
  };
  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );
  }

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === id;
  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>
          {user ? (
            <UserProfile 
              user={user}
              viewer={viewer}
              viewerIsUser={viewerIsUser}
              setViewer={setViewer}
              handleUserRefetch={handleUserRefetch}
            />
         ) : null}
        </Col>
        <Col xs={24}>
          {userListings ? (
            <UserListings
              userListings={userListings}
              listingsPage={listingsPage}
              limit={PAGE_LIMIT}
              setListingsPage={setListingsPage}
            />
          ) : null}
        </Col>
        <Col xs={24}>
          {userListings ? (
            <UserBookings
              userBookings={userBookings}
              bookingsPage={bookingsPage}
              limit={PAGE_LIMIT}
              setBookingsPage={setBookingsPage}
            />
          ) : null}
        </Col>
      </Row>
  </Content>
  );
}
