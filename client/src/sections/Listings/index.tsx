import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Affix, Layout, List, Typography } from 'antd';

import { ListingCard, ErrorBanner } from '../../lib/components';
import { LISTINGS } from '../../lib/graphql/queries';
import { Listings as ListingData, ListingsVariables } from '../../lib/graphql/queries/Listings/__generated__/Listings';
import { ListingsFilter } from '../../lib/graphql/globalTypes';
import { ListingsFilters, ListingsPagination, ListingsSkeleton } from './components';


const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;
const PAGE_LIMIT = 8;

export const Listings = () => {
  const { location } = useParams();
  const locationRef = useRef(location);
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<ListingData, ListingsVariables>(LISTINGS, {
    variables: {
      location,
      filter: ListingsFilter.PRICE_LOW_TO_HIGH,
      limit: PAGE_LIMIT,
      page
    }
  });

  useEffect(() => {
    setPage(1);
    locationRef.current = location;
  }, [location])
  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  return (
    <Content className="listings">
      {loading && <ListingsSkeleton />}
       {error && (
        <>
          <ErrorBanner description="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords." />
          <ListingsSkeleton />
        </>
      )}
      {listingsRegion && (
        <Title level={3} className="listings__title">
          Results for "{listingsRegion}"
        </Title>
      )}
      {listings && listings.result.length ? (
        <div>
          {/* TODO: fix Affix render same children */}
          {/* <Affix offsetTop={64}> */} 
            <ListingsPagination
              total={listings.total}
              page={page}
              limit={PAGE_LIMIT}
              setPage={setPage}
            />
            <ListingsFilters filter={filter} setFilter={setFilter} />
          {/* </Affix> */}
          <List
            grid={{
              gutter: 8,
              xs: 1,
              sm: 2,
              lg: 4
            }}
            dataSource={listings.result}
            renderItem={listing => (
              <List.Item>
                <ListingCard listing={listing} />
              </List.Item>
            )}
            />
        </div>
    ) : (
      <div>
        <Paragraph>
          It appears that no listings have yet been created for{" "}
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          Be the first person to create a <Link to="/host">listing in this area</Link>!
        </Paragraph>
      </div>
    )}
  </Content>
  );
};