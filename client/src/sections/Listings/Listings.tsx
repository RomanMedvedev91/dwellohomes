import React from 'react'
// import { DeleteListingData, DeleteListingVariables, ListingsData } from "./types";
// import { useMutation, useQuery } from '../../lib/api';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables
} from "./__generated__/DeleteListing";


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

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if(error) {
    return <h2>Oh! something went wrong - please try again</h2>
  }
  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h4>Deletion in progress...</h4>
  ) : null;
  const deleteListingErrorMessage = deleteListingError ? (
    <h4>Uh oh! Something went wrong with deleting :(. Please try again soon.</h4>
  ) : null;

  return (
    <div>
      <h2>{title}</h2>
        {data?.listings.map(listing => (
          <li key={listing.id}>
            {listing.title}{" "}
            <button 
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </button>
            </li>
        ))}
        {deleteListingLoadingMessage}
        {deleteListingErrorMessage}
      <ul>
      </ul>
    </div>
  )
}
