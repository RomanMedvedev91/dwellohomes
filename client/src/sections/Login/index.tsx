import React, { useEffect, useRef  } from 'react'
import { useNavigate } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/client';
import { Card, Layout, Typography, Spin } from "antd";

// Image Assets
import googleLogo from "./assets/google_logo.jpg";
import { Viewer } from '../../lib/types';
import { AUTH_URL } from "../../lib/graphql/queries";
import { LOG_IN } from "../../lib/graphql/mutations";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import {
  LogIn as LogInData,
  LogInVariables
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { ErrorBanner } from "../../lib/components";
import { displaySuccessNotification, displayErrorMessage } from "../../lib/utils";

const { Content } = Layout;
const { Text, Title } = Typography;
interface ILoginProps {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: ILoginProps) => {
  const client = useApolloClient();
  let navigate = useNavigate();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError }
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: data => {
      if (data && data.logIn && data.logIn.token) {
        setViewer(data.logIn);
        sessionStorage.setItem('token', data.logIn.token);
        displaySuccessNotification("You've successfully logged in!");
      }
    }
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code }
        }
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL
      });
      console.log("Client data: ", data);
      window.location.href = data.authUrl;
    } catch(err) {
      displayErrorMessage("Sorry! We weren't able to log you in. Please try again later!");
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    navigate(`/user/${viewerId}`);
  }

  return (
    <Content className="log-in">
    {logInError ? <ErrorBanner description="We weren't able to log you in. Please try again soon." /> : null}
    <Card className="log-in-card">
      <div className="log-in-card__intro">
        <Title level={3} className="log-in-card__intro-title">
          <span role="img" aria-label="wave">
            👋
          </span>
        </Title>
        <Title level={3} className="log-in-card__intro-title">
          Log in to Dwello Homes!
        </Title>
        <Text>Sign in with Google to start booking available rentals!</Text>
      </div>
      <button className="log-in-card__google-button" onClick={handleAuthorize}>
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">Sign in with Google</span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form to sign in
          with your Google account.
        </Text>
    </Card>
  </Content>
  )
}
