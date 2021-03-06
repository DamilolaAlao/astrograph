import { withFilter } from "graphql-subscriptions";
import _ from "lodash";

import * as resolvers from "./shared";

import { createBatchResolver, eventMatches, makeConnection } from "./util";

import {
  IHorizonEffectData,
  IHorizonOperationData,
  IHorizonTradeData,
  IHorizonTransactionData
} from "../../datasource/types";

import { Account, Balance, DataEntry, Effect, Operation, Trade, Transaction } from "../../model";
import {
  BalanceFactory,
  EffectFactory,
  OperationFactory,
  TradeFactory,
  TransactionWithXDRFactory
} from "../../model/factories";

import { db } from "../../database";
import { IApolloContext } from "../../graphql_server";
import { joinToMap } from "../../util/array";

import { ACCOUNT, pubsub } from "../../pubsub";

const dataEntriesResolver = createBatchResolver<Account, DataEntry[]>((source: any) =>
  db.dataEntries.findAllByAccountIDs(_.map(source, "id"))
);

const balancesResolver = createBatchResolver<Account, Balance[]>(async (source: Account[]) => {
  const accountIDs = source.map(s => s.id);
  const balances = await db.trustLines.findAllByAccountIDs(accountIDs);

  const map = joinToMap(accountIDs, balances);

  for (const [accountID, accountBalances] of map) {
    const account = source.find((acc: Account) => acc.id === accountID);

    if (!account) {
      continue;
    }

    accountBalances.unshift(BalanceFactory.nativeForAccount(account));
  }

  return balances;
});

const accountSubscription = (event: string) => {
  return {
    subscribe: withFilter(
      () => pubsub.asyncIterator([event]),
      (payload, variables) => {
        return eventMatches(variables.args, payload.id, payload.mutationType);
      }
    ),

    resolve(payload: any) {
      return payload;
    }
  };
};

export default {
  Account: {
    data: dataEntriesResolver,
    balances: balancesResolver,
    ledger: resolvers.ledger,
    operations: async (root: Account, args: any, ctx: IApolloContext) => {
      return makeConnection<IHorizonOperationData, Operation>(
        await ctx.dataSources.operations.forAccount(root.id, args),
        r => OperationFactory.fromHorizon(r)
      );
    },
    payments: async (root: Account, args: any, ctx: IApolloContext) => {
      const records = await ctx.dataSources.payments.forAccount(root.id, args);
      return makeConnection<IHorizonOperationData, Operation>(records, r => OperationFactory.fromHorizon(r));
    },
    effects: async (root: Account, args: any, ctx: IApolloContext) => {
      const records = await ctx.dataSources.effects.forAccount(root.id, args);
      return makeConnection<IHorizonEffectData, Effect>(records, r => EffectFactory.fromHorizon(r));
    },
    transactions: async (root: Account, args: any, ctx: IApolloContext) => {
      return makeConnection<IHorizonTransactionData, Transaction>(
        await ctx.dataSources.transactions.forAccount(root.id, args),
        r => TransactionWithXDRFactory.fromHorizon(r)
      );
    },
    trades: async (root: Account, args: any, ctx: IApolloContext, info: any) => {
      return makeConnection<IHorizonTradeData, Trade>(await ctx.dataSources.trades.forAccount(root.id, args), r =>
        TradeFactory.fromHorizon(r)
      );
    },

    inflationDestination: resolvers.account
  },
  Query: {
    account: async (root: any, args: any) => {
      const acc = await db.accounts.findByID(args.id);
      return acc;
    },
    accounts: async (root: any, args: any) => {
      return db.accounts.findAllByIDs(args.id);
    }
  },
  Subscription: {
    account: accountSubscription(ACCOUNT)
  }
};
