import React from 'react';
import { Avatar, Button, Card, Divider, Tag, Typography } from "antd";
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User';
import { DISCONNECT_STRIPE } from "../../../../lib/graphql/mutations/";
import { DisconnectStripe as DisconnectStripeData } from "../../../../lib/graphql/mutations/DisconnectStripe/__generated__/DisconnectStripe";
import {
  formatListingPrice,
  displaySuccessNotification,
  displayErrorMessage
} from "../../../../lib/utils";
import { useMutation } from '@apollo/client';
import { Viewer } from '../../../../lib/types';

const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write`;

interface IUserProfile {
  user: UserData["user"];
  viewer: Viewer;
  viewerIsUser: boolean;
  setViewer: (viewer: Viewer) => void;
  handleUserRefetch: () => void;
}

const { Paragraph, Text, Title } = Typography;

export const UserProfile = ({ user, viewer, viewerIsUser, setViewer, handleUserRefetch }: IUserProfile) => {
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
    DISCONNECT_STRIPE,
    {
      onCompleted: data => {
        if (data && data.disconnectStripe) {
          setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
          displaySuccessNotification(
            "You've successfully disconnected from Stripe!",
            "You'll have to reconnect with Stripe to continue to create listings."
          );
          handleUserRefetch();
        }
      },
      onError: () => {
        displayErrorMessage(
          "Sorry! We weren't able to disconnect you from Stripe. Please try again later!"
        );
      }
    }
  );
  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  };
  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className="user-profile__details">
          <Title level={4}>Details</Title>
          <Paragraph>
            Name: <Text strong>{user.name}</Text>
          </Paragraph>
          <Paragraph>
            Contact: <Text strong>{user.contact}</Text>
          </Paragraph>
        </div>
        {viewerIsUser ? (
          <>
            <Divider />
            <div className="user-profile__details">
              <Title level={4}>Additional Details</Title>
              {user.hasWallet ? (
              <>
                <Paragraph>
                  <Tag color="green">Stripe Registered</Tag>
                </Paragraph>
                <Paragraph>
                  Income Earned:{" "}
                  <Text strong>{user.income ? formatListingPrice(user.income) : `$0`}</Text>
                </Paragraph>
                <Button
                  type="primary"
                  className="user-profile__details-cta"
                  loading={loading}
                  onClick={() => disconnectStripe()}
                >
                  Disconnect Stripe
                </Button>
                <Paragraph type="secondary">
                  By disconnecting, you won't be able to receive{" "}
                  <Text strong>any further payments</Text>. This will prevent users from booking
                  listings that you might have already created.
                </Paragraph>
              </>
              ) : (
                <>
                <Paragraph>
                  Interested in becoming a Dwello Homes host? Register with your Stripe account!
                </Paragraph>
                <Button
                  type="primary"
                  className="user-profile__details-cta"
                  onClick={redirectToStripe}
                >
                  Connect with Stripe!
                </Button>
                <Paragraph type="secondary">
                  TinyHouse uses{" "}
                  <a
                    href="https://stripe.com/en-US/connect"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Stripe
                  </a>{" "}
                  to help transfer your earnings in a secure and trusted manner.
                </Paragraph>
              </>
              )}
            </div>
          </>
        ) : null}
      </Card>
  </div>
  )
}
