import merge from "lodash.merge";
import { ListingResolvers } from "./Listing";

export const resolvers = merge(ListingResolvers);

// TODO: 
// export const resolvers = merge(bookingResolvers, listingResolvers, userResolvers);