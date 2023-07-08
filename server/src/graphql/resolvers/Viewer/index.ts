import crypto from "crypto";
import { IResolvers } from "apollo-server-express";
import { Google } from "../../../lib/api";
import { Viewer, Database, User } from "../../../lib/types";

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    }
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db }: { db: Database }
    ): Promise<Viewer> => {
      const code = input ? input.code : null;
      const token = crypto.randomBytes(16).toString("hex");

      const viewer: User | undefined = code
      ? await logInViaGoogle(code, token, db)
      : undefined;

    },
    logOut: () => {
      return "Mutation.logOut";
    }
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
    hasWallet: (viewer: Viewer): boolean | undefined => {
      return viewer.walletId ? true : undefined;
    }
  }
};