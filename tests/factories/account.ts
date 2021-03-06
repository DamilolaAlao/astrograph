import { Factory } from "rosie";
import stellar from "stellar-base";
import { Account } from "../../src/model";

Factory.define("account")
  .attr("id", () => stellar.Keypair.random().publicKey())
  .attr("balance", "19729999500")
  .attr("sequenceNumber", "12884901893")
  .attr("numSubentries", 1)
  .attr("inflationDest", "")
  .attr("homeDomain", "")
  .attr("thresholds", "AQAAAA==")
  .attr("flags", 0)
  .attr("lastModified", 6);

export default {
  build(overrides?: object): Account {
    const data = Factory.attributes("account", overrides);
    return new Account(data);
  }
};
