import { withFilter } from "graphql-subscriptions";
import { IApolloContext } from "../../graphql_server";
import { BalanceSubscriptionPayload } from "../../model";
import { BALANCE, pubsub } from "../../pubsub";
import * as resolvers from "./shared";
import { eventMatches } from "./util";

const balanceSubscription = (event: string) => {
  return {
    subscribe: withFilter(
      () => pubsub.asyncIterator(event),
      (payload: BalanceSubscriptionPayload, variables) => {
        return eventMatches(variables.args, payload.account, payload.mutationType);
      }
    ),

    resolve(payload: any, args: any, ctx: IApolloContext, info: any) {
      return payload;
    }
  };
};

export default {
  Balance: {
    account: resolvers.account,
    ledger: resolvers.ledger,
    asset: resolvers.asset
  },
  BalanceSubscriptionPayload: {
    account: resolvers.account,
    asset: resolvers.asset
  },
  BalanceValues: {
    account: resolvers.account,
    asset: resolvers.asset
  },
  Subscription: { balance: balanceSubscription(BALANCE) }
};
