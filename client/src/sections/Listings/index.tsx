import React from 'react';
import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Layout, List, Typography } from 'antd';

import { ListingCard } from '../../lib/components';
import { LISTINGS } from '../../lib/graphql/queries';
import { Listings as ListingData, ListingsVariables } from '../../lib/graphql/queries/Listings/__generated__/Listings';
import { ListingsFilter } from '../../lib/graphql/globalTypes';


const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;
const PAGE_LIMIT = 8;

export const Listings = () => {
  const { location } = useParams();
  console.log('params ', location);
  const { data } = useQuery<ListingData, ListingsVariables>(LISTINGS, {
    variables: {
      location,
      filter: ListingsFilter.PRICE_LOW_TO_HIGH,
      limit: PAGE_LIMIT,
      page: 1
    }
  });

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  return (
    <Content className="listings">
      {listingsRegion && (
        <Title level={3} className="listings__title">
          Results for "{listingsRegion}"
        </Title>
      )}
      {listings && listings.result.length ? (
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