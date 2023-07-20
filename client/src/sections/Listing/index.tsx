import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { Layout } from "antd";
import { useParams } from 'react-router-dom';

import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { LISTING } from '../../lib/graphql/queries'
import {
  Listing as ListingData,
  ListingVariables
} from '../../lib/graphql/queries/Listing/__generated__/Listing';
import { Viewer } from '../../lib/types';

interface IListingProps {
  viewer: Viewer;
}

const { Content } = Layout;
const PAGE_LIMIT = 3;

export const Listing = ({ viewer }:IListingProps) => {
  const { id } = useParams();
  const [bookingsPage, setBookingsPage] = useState(1);
  const { loading, data, error } = useQuery<ListingData, ListingVariables>(LISTING, {
    variables: id ? {
      id,
      bookingsPage,
      limit: PAGE_LIMIT
    } : undefined
  });

  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon!" />
        <PageSkeleton />
      </Content>
    );
  }
  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  return (
    <div>Listing</div>
  )
}
