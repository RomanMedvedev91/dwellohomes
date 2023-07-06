import merge from "lodash.merge";
import { viewerResolver } from "./Viewer";

export const resolvers = merge(viewerResolver);

// TODO: 
// export const resolvers = merge(bookingResolvers, listingResolvers, userResolvers);