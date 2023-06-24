import React, { useEffect, useState } from 'react'
import { server } from '../../lib/api';
import { DeleteListingData, DeleteListingVariables, ListingsData, type Listing } from "./types";

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
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    setListings(data.listings);
  };

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id
      }
    });
    fetchListings();
  };

  return (
    <div>
      <h2>{title}</h2>
        {listings?.map(listing => (
          <li key={listing.id}>
            {listing.title}{" "}
            <button 
              onClick={() => deleteListing(listing.id)}
            >
              Delete
            </button>
            </li>
        ))}
      <button onClick={fetchListings}>Query Listings!</button>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
      <ul>
      </ul>
    </div>
  )
}
