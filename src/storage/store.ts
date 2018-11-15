import { Asset } from "stellar-sdk";
import { LedgerHeader, Transaction } from "../model";
import { Connection } from "./connection";

import { LedgerBuilder } from "../storage2/builders/ledger";
import { TransactionBuilder } from "../storage2/builders/transaction";
import { OperationBuilder } from "../storage2/builders/operation";
import { Cache } from "../storage2/cache";

import * as nquads from "./nquads";
import * as writers from "./writers";

export class Store {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async account(id: string): Promise<nquads.Value> {
    return (await writers.AccountWriter.build(this.connection, id)).write();
  }

  public async asset(asset: Asset): Promise<nquads.Value> {
    return (await writers.AssetWriter.build(this.connection, asset)).write();
  }

  public async ledger(header: LedgerHeader): Promise<nquads.Value> {
    return (await writers.LedgerWriter.build(this.connection, header)).write();
  }

  public async transaction(transaction: Transaction): Promise<nquads.Value> {
    return (await writers.TransactionWriter.build(this.connection, transaction)).write();
  }

  public async operation(transaction: Transaction, index: number) {
    return (await writers.OperationWriter.build(this.connection, transaction, index)).write();
  }

  public async importLedgerTransactions(header: LedgerHeader, transactions: Transaction[]) {
    let nquads = new LedgerBuilder(header).build();

    for (const transaction of transactions) {
      nquads = nquads.concat(new TransactionBuilder(transaction).build());

      for (let index = 0; index < transaction.operationsXDR().length; index++) {
        nquads = nquads.concat(new OperationBuilder(transaction, index).build());
      }
    }

    const c = new Cache(this.connection, nquads);
    nquads = await c.populate();
console.log(nquads.join("\n"));
    const result = await this.connection.push(nquads.join("\n"));
    c.put(result);
  }
}
