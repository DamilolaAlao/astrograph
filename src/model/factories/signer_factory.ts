import stellar from "stellar-base";
import { ISigner, Signer } from "../signer";

export interface ISignerTableRow {
  accountid: string;
  publickey: string;
  weight: number;
}

export class SignerFactory {
  public static fromXDR(xdr: any, accountID: string) {
    const data: ISigner = {
      accountID,
      signer: SignerFactory.keyFromXDR(xdr.key()),
      weight: xdr.weight()
    };

    return new Signer(data);
  }

  public static fromDb(row: ISignerTableRow): Signer {
    const data: ISigner = {
      accountID: row.accountid,
      signer: row.publickey,
      weight: row.weight
    };

    return new Signer(data);
  }

  public static self(id: string, weight: number): Signer {
    return new Signer({ accountID: id, signer: id, weight });
  }

  public static keyFromXDR(xdr: any): string {
    switch (xdr.switch()) {
      case stellar.xdr.SignerKeyType.signerKeyTypeEd25519():
        return stellar.StrKey.encodeEd25519PublicKey(xdr.ed25519());

      case stellar.xdr.SignerKeyType.signerKeyTypePreAuthTx():
        return stellar.StrKey.encodePreAuthTx(xdr.preAuthTx());
    }

    if (xdr.switch() !== stellar.xdr.SignerKeyType.signerKeyTypeHashX()) {
      throw new Error("We've encountered unknown XDR signer type");
    }

    return stellar.StrKey.encodeSha256Hash(xdr.hashX());
  }
}
