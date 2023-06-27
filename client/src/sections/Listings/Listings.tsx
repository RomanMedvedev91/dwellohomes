import React, { useEffect, useState } from 'react'
import { server } from '../../lib/api';
import { DeleteListingData, DeleteListingVariables, ListingsData, type Listing } from "./types";
import { useQuery } from '../../lib/api';

const LISTINGS = `
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

const DELETE_LISTING = `
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
  const { data, refetch } = useQuery<ListingsData>(LISTINGS);

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id
      }
    });
    refetch();
  };

  return (
    <div>
      <h2>{title}</h2>
        {data?.listings.map(listing => (
          <li key={listing.id}>
            {listing.title}{" "}
            <button 
              onClick={() => deleteListing(listing.id)}
            >
              Delete
            </button>
            </li>
        ))}
      <ul>
      </ul>
    </div>
  )
}
