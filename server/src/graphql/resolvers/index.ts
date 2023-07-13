import merge from "lodash.merge";
import { viewerResolvers } from "./Viewer";
import { userResolvers } from "./User";

export const resolvers = merge(viewerResolvers, userResolvers);

// TODO: 
// export const resolvers = merge(bookingResolvers, listingResolvers, userResolvers);