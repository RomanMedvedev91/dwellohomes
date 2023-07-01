import { Skeleton, Divider, Alert } from 'antd';

import "./styles/ListingsSkeleton.css";
import { ApolloError } from '@apollo/client';

interface IListingsSkeletonProps {
  title: string;
  error?: ApolloError;
}
export const  ListingsSkeleton = ({ title, error }: IListingsSkeletonProps) => {
  return (
    <div className="listings-skeleton">
      {error ? (
      <Alert
        type="error"
        message="Uh oh! Something went wrong :(. Please try again later."
        className="listings-skeleton__alert"
      />
      ) : null}
      <h2>{title}</h2>
      <Skeleton active paragraph={{ rows: 1 }} />;
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />;
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />;
    </div>
  )
}
