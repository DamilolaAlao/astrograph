import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar TimeBounds
  scalar MemoValue
  scalar DateTime

  enum Order {
    desc
    asc
  }

  type PageInfo {
    startCursor: String
    endCursor: String
  }

  enum MemoType {
    id
    text
    hash
    return
    none
  }

  enum MutationType {
    CREATE
    UPDATE
    REMOVE
  }

  type Memo {
    value: MemoValue
    type: MemoType!
  }

  interface IDataEntry {
    name: String!
    value: String!
    ledger: Ledger!
  }

  type DataEntry implements IDataEntry {
    account: Account!
    name: String!
    value: String!
    ledger: Ledger!
  }

  type DataEntryValues implements IDataEntry {
    account: Account!
    name: String!
    value: String!
    ledger: Ledger!
  }

  type DataEntrySubscriptionPayload {
    account: Account!
    name: String!
    mutationType: MutationType!
    values: DataEntryValues
  }

  interface IBalance {
    asset: Asset!
    limit: String!
    balance: String!
    authorized: Boolean!
  }

  type Balance implements IBalance {
    account: Account
    asset: Asset!
    limit: String!
    balance: String!
    authorized: Boolean!
    ledger: Ledger!
  }

  type BalanceValues implements IBalance {
    account: Account
    asset: Asset!
    limit: String!
    balance: String!
    authorized: Boolean!
  }

  type BalanceSubscriptionPayload {
    account: Account!
    asset: Asset!
    mutationType: MutationType!
    values: BalanceValues
  }

  input EventInput {
    mutationTypeIn: [MutationType!]
    idEq: AccountID
    idIn: [AccountID!]
  }

  type Subscription {
    balance(args: EventInput): BalanceSubscriptionPayload
    dataEntry(args: EventInput): DataEntrySubscriptionPayload
  }

`;
