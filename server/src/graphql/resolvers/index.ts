import merge from "lodash.merge";
import { viewerResolvers } from "./Viewer";
import { userResolvers } from "./User";
import { bookingResolvers } from "./Booking";
import { listingResolvers } from "./Listing";

export const resolvers = merge(viewerResolvers, userResolvers, listingResolvers, bookingResolvers);

// TODO: 
// export const resolvers = merge(bookingResolvers, listingResolvers, userResolvers);