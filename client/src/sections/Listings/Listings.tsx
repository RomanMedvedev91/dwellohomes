import React from 'react'
// import { DeleteListingData, DeleteListingVariables, ListingsData } from "./types";
import { Alert, Avatar, List, Button, Spin } from "antd";
import { useQuery, useMutation, gql } from '@apollo/client';

import './styles/Listings.css';
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables
} from "./__generated__/DeleteListing";
import { ListingsSkeleton } from './components/ListingsSkeleton/ListingsSkeleton';


const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface IListingsProps {
  title: string;
}

export const  Listings = ({ title }: IListingsProps) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);
  const [deleteListing, {
    loading: deleteListingLoading,
    error: deleteListingError
  }] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } })
    refetch();
  };

  return (
    <>
      {(loading || error) && <ListingsSkeleton title={title} error={error} />}
      <div className="listings">
        {deleteListingError ? (
          <Alert
            type="error"
            message="Uh oh! Something went wrong :(. Please try again later."
            className="listings__alert"
          />
        ) : null}
        <Spin spinning={deleteListingLoading}>
          <h2>{title}</h2>
          {data ? (
              <List
              itemLayout="horizontal"
              dataSource={data.listings}
              renderItem={listing => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                    Delete
                  </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={listing.title}
                    description={listing.address}
                    avatar={<Avatar src={listing.image} shape="square" size={48} />}
                    />
                </List.Item>
              )}
              />
          ) : null}
        </Spin>
      </div>
    </>
  )
}
