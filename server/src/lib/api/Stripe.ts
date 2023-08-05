import Stripe from 'stripe';

const S_SECRET_KEY = `${process.env.S_SECRET_KEY}`;
const client = new Stripe(S_SECRET_KEY, { apiVersion: '2022-11-15' });

export const StripeConnection = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      grant_type: "authorization_code",
      code
    });

    return response;
  }
};