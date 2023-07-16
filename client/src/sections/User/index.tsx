import React from 'react'
import { useQuery } from "@apollo/client";
import { useParams } from 'react-router-dom';
import { Col, Layout, Row } from "antd";

import { USER } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables
} from "../../lib/graphql/queries/User/__generated__/User";
import { UserProfile } from "./components";
import { Viewer } from '../../lib/types';
import { ErrorBanner, PageSkeleton } from '../../lib/components';

const { Content } = Layout;

interface IUserProps {
  viewer: Viewer;
}
export const User = ({ viewer }: IUserProps) => {
  const { id } = useParams();

  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: id ? { id } : undefined
  });

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

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>
          {user ? <UserProfile user={user} viewerIsUser={viewerIsUser} /> : null}
        </Col>
      </Row>
  </Content>
  );
}
