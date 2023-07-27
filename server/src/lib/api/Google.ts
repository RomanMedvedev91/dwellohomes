import { google } from 'googleapis';
import {Client, AddressComponent, AddressType} from "@googlemaps/google-maps-services-js";

const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

const maps = new Client({});
const G_GEOCODE_KEY = `${process.env.G_GEOCODE_KEY}`;
const parseAddress = (addressComponents: AddressComponent[]) => {
  let country = null;
  let admin = null;
  let city = null;

  for (const component of addressComponents) {
    if (component.types.includes("country" as AddressType)) {
      country = component.long_name;
    }
    if (component.types.includes("administrative_area_level_1" as AddressType)) {
      admin = component.long_name;
    }
    if (component.types.includes("locality" as AddressType) ||
    component.types.includes("postal_town" as AddressType)) {
      city = component.long_name;
    }
  }

  return { country, admin, city };
}

export const Google = {
  authUrl: auth.generateAuthUrl({
    access_type: "online",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  }),
  logIn: async (code: string) => {
    const { tokens } = await auth.getToken(code);

    auth.setCredentials(tokens);

    const { data } = await google.people({ version: "v1", auth }).people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos"
    });
    return { user: data }
  },
  geocode: async (address: string) => {
    const res = await maps.geocode({
      params: {
        key: G_GEOCODE_KEY,
        address
      }
    });

    // if (res.status < 200 || res.status > 299) {
    //   throw new Error (`failed to geocode address`);
    // }
    // maps.geocode({
    //   params: {
    //     key: G_GEOCODE_KEY,
    //     address
    //   }
    // }).then((res) => {
    //   return parseAddress(res.data.results[0].address_components);
    // }).catch((e) => {
    //   throw new Error (`failed to geocode address ${e.response.data.error_message}`);
    // })

    return parseAddress(res.data.results[0].address_components);
    // const resJson = JSON.stringify(res.data.results[0]);
  // console.log(`First result is: ${resJson}`);
  }
};