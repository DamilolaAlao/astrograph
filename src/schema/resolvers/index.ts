import accountResolvers from "./account";
import assetResolvers from "./asset";
import balanceResolvers from "./balance";
import dataEntryResolvers from "./data_entry";
import effectResolvers from "./effect";
import ledgerResolvers from "./ledger";
import offerResolvers from "./offer";
import operationResolvers from "./operation";
import orderBookResolvers from "./order_book";
import paymentPathResolvers from "./payment_path";
import signerResolvers from "./signer";
import tradeAggregationsResolvers from "./trade_aggregations";
import tradesResolvers from "./trades";
import transactionResolvers from "./transaction";

export default [
  accountResolvers,
  effectResolvers,
  assetResolvers,
  dataEntryResolvers,
  ledgerResolvers,
  offerResolvers,
  operationResolvers,
  signerResolvers,
  transactionResolvers,
  balanceResolvers,
  orderBookResolvers,
  paymentPathResolvers,
  tradeAggregationsResolvers,
  tradesResolvers
];
