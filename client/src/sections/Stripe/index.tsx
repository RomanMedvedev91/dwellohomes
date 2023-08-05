import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from '@apollo/client';
import { Layout, Spin } from "antd";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations";
import {
  ConnectStripe as ConnectStripeData,
  ConnectStripeVariables
} from "../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe";
import { displaySuccessNotification } from "../../lib/utils";
import { Viewer } from "../../lib/types";

interface IStripeProps {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;

export const Stripe = ({ viewer, setViewer }: IStripeProps) => {
  let navigate = useNavigate();
  const url = useParams();
  const [connectStripe, { data, loading, error }] = useMutation<
    ConnectStripeData,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: data => {
      if (data && data.connectStripe) {
        setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
        displaySuccessNotification(
          "You've successfully connected your Stripe Account!",
          "You can now begin to create listings in the Host page."
        );
      }
    }
  });
  const connectStripeRef = useRef(connectStripe);

  console.log("URL ", url);
  useEffect(() => {
    console.log("USE EFFECT URL ", url);
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      connectStripeRef.current({
        variables: {
          input: { code }
        }
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  if (data && data.connectStripe) {
    navigate(`/user/${viewer.id}`, { replace: true });
  }

  if (loading) {
    return (
      <Content className="stripe">
        <Spin size="large" tip="Connecting your Stripe account..." />
      </Content>
    );
  }

  if (error) {
    navigate(`/user/${viewer.id}?stripe_error=true`);
  }

  return <div>hello</div>;
};