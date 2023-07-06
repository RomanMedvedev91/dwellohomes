import merge from "lodash.merge";
import { viewerResolvers } from "./Viewer";

export const resolvers = merge(viewerResolvers);

// TODO: 
// export const resolvers = merge(bookingResolvers, listingResolvers, userResolvers);