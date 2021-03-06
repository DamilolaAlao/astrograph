import { MemoHash, MemoID, MemoNone, MemoReturn, MemoText } from "stellar-sdk";
import { AccountID } from "../model/account_id";
import { AssetCode } from "../model/asset_code";

export type HorizonAccountFlag = "auth_required" | "auth_immutable" | "auth_revocable";

export type HorizonAssetType = "native" | "credit_alphanum4" | "credit_alphanum12";
export type HorizonOpType =
  | "create_account"
  | "payment"
  | "path_payment"
  | "manage_offer"
  | "create_passive_offer"
  | "set_options"
  | "change_trust"
  | "allow_trust"
  | "account_merge"
  | "manage_data"
  | "bump_sequence";

type HorizonEffectType =
  | "account_created"
  | "account_removed"
  | "account_credited"
  | "account_debited"
  | "account_thresholds_updated"
  | "account_home_domain_updated"
  | "account_flags_updated"
  | "account_inflation_destination_updated"
  | "signer_created"
  | "signer_removed"
  | "signer_updated"
  | "trustline_created"
  | "trustline_removed"
  | "trustline_updated"
  | "trustline_authorized"
  | "trustline_deauthorized"
  | "offer_created"
  | "offer_removed"
  | "offer_updated"
  | "trade"
  | "data_created"
  | "data_removed"
  | "data_updated"
  | "sequence_bumped";

interface IBaseOperationData {
  id: string;
  paging_token: any;
  source_account: AccountID;
  transaction_hash: string;
  created_at: string;
  type: HorizonOpType;
  type_i: number;
}

export interface ICreateAccountOperationData {
  account: string;
  funder: string;
  starting_balance: string;
}

export interface IPaymentOperationData extends IBaseOperationData {
  from: AccountID;
  to: AccountID;
  asset_type: HorizonAssetType;
  asset_code: AssetCode;
  asset_issuer: AccountID;
  amount: string;
}

export interface IPathPaymentOperationData extends IBaseOperationData {
  from: AccountID;
  to: AccountID;
  asset_code: AssetCode;
  asset_issuer: AccountID;
  asset_type: HorizonAssetType;
  amount: string;
  source_asset_code: AssetCode;
  source_asset_issuer: AccountID;
  source_asset_type: string;
  source_max: string;
  source_amount: string;
}

export interface IManageOfferOperationData extends IBaseOperationData {
  offer_id: number;
  amount: string;
  buying_asset_code: AssetCode;
  buying_asset_issuer: AccountID;
  buying_asset_type: HorizonAssetType;
  price: string;
  price_r: { n: number; d: number };
  selling_asset_code: AssetCode;
  selling_asset_issuer: AccountID;
  selling_asset_type: HorizonAssetType;
}

export interface ICreatePassiveOfferOperationData extends IBaseOperationData {
  amount: string;
  price: string;
  price_r: { n: number; d: number };
  buying_asset_type: HorizonAssetType;
  buying_asset_code: AssetCode;
  buying_asset_issuer: AccountID;
  selling_asset_type: HorizonAssetType;
  selling_asset_code: AssetCode;
  selling_asset_issuer: AccountID;
}

export interface ISetOptionsOperationData extends IBaseOperationData {
  signer_key: AccountID;
  signer_weight: number;
  master_key_weight: number;
  low_threshold: number;
  med_threshold: number;
  high_threshold: number;
  home_domain: string;
  inflation_dest: string;
  set_flags: number[];
  set_flags_s: HorizonAccountFlag[];
  clear_flags: number[];
  clear_flags_s: HorizonAccountFlag[];
}

export interface IChangeTrustOperationData extends IBaseOperationData {
  asset_code: AssetCode;
  asset_issuer: AccountID;
  asset_type: string;
  trustee: AccountID;
  trustor: AccountID;
  limit: string;
}

export interface IAllowTrustOperationData extends IBaseOperationData {
  asset_code: AssetCode;
  asset_issuer: AccountID;
  asset_type: string;
  authorize: boolean;
  trustee: AccountID;
  trustor: AccountID;
}

export interface IAccountMergeOperationData extends IBaseOperationData {
  into: AccountID;
}

export interface IManageDataOperationData extends IBaseOperationData {
  name: string;
  value: string;
}

export interface IBumpSequenceOperationData extends IBaseOperationData {
  bump_to: string;
}

export type IHorizonOperationData = IPaymentOperationData &
  ISetOptionsOperationData &
  IAccountMergeOperationData &
  IAllowTrustOperationData &
  IBumpSequenceOperationData &
  IChangeTrustOperationData &
  ICreateAccountOperationData &
  IManageDataOperationData &
  IManageOfferOperationData &
  ICreatePassiveOfferOperationData &
  IPathPaymentOperationData;

export interface IHorizonTransactionData {
  id: string;
  paging_token: string;
  successful: boolean;
  ledger: number;
  created_at: string;
  source_account: AccountID;
  envelope_xdr: string;
  result_xdr: string;
  result_meta_xdr: string;
  fee_meta_xdr: string;
  memo_type: typeof MemoNone | typeof MemoID | typeof MemoHash | typeof MemoReturn | typeof MemoText;
}

export interface IHorizonAssetData {
  asset_type: HorizonAssetType;
  asset_code: AssetCode;
  asset_issuer: AccountID;
  paging_token: string;
  amount: string;
  num_accounts: number;
  flags: { [flag in HorizonAccountFlag]: boolean };
}

export interface IHorizonOrderBookEntry {
  price: string;
  amount: string;
}

export interface IHorizonOrderBookData {
  bids: IHorizonOrderBookEntry[];
  asks: IHorizonOrderBookEntry[];
}

export interface IHorizonPaymentPathData {
  source_asset_type: HorizonAssetType;
  source_asset_code: AssetCode;
  source_asset_issuer: AccountID;
  source_amount: string;
  destination_asset_type: HorizonAssetType;
  destination_asset_code: AssetCode;
  destination_asset_issuer: AccountID;
  destination_amount: string;
  path: Array<{
    asset_type: HorizonAssetType;
    asset_code: AssetCode;
    asset_issuer: AccountID;
  }>;
}

export interface IHorizonTradeAggregationData {
  timestamp: number;
  trade_count: number;
  base_volume: string;
  counter_volume: string;
  avg: string;
  high: string;
  low: string;
  open: string;
  close: string;
}

export interface IHorizonTradeData {
  id: string;
  paging_token: string;
  ledger_close_time: string;
  offer_id: string;
  base_offer_id: string;
  base_account: string;
  base_amount: string;
  base_asset_type: string;
  base_asset_code: string;
  base_asset_issuer: string;
  counter_offer_id: string;
  counter_account: string;
  counter_amount: string;
  counter_asset_type: string;
  counter_asset_code: string;
  counter_asset_issuer: string;
  base_is_seller: boolean;
  price: {
    n: number;
    d: number;
  };
}
interface IBaseEffect {
  id: string;
  paging_token: string;
  account: AccountID;
  type: HorizonEffectType;
  created_at: string;
}

interface IAccountCreatedEffect extends IBaseEffect {
  starting_balance: string;
}

interface IAccountCreditedEffect extends IBaseEffect {
  amount: string;
}

interface IAccountDebitedEffect extends IBaseEffect {
  amount: string;
}

interface IAccountThresholdsUpdatedEffect extends IBaseEffect {
  low_threshold: number;
  med_threshold: number;
  high_threshold: number;
}

interface IAccountHomeDomainUpdatedEffect extends IBaseEffect {
  home_domain: string;
}

interface IAccountFlagsUpdatedEffect extends IBaseEffect {
  auth_required_flag?: boolean;
  auth_revokable_flag?: boolean;
}

interface ISequenceBumpedEffect extends IBaseEffect {
  new_seq: number;
}

interface ISignerCreatedEffect extends IBaseEffect {
  weight: number;
  public_key: string;
  key: string;
}

interface ISignerRemovedEffect extends IBaseEffect {
  weight: number;
  public_key: string;
  key: string;
}

interface ISignerUpdatedEffect extends IBaseEffect {
  weight: number;
  public_key: string;
  key: string;
}

interface ITrustlineCreatedEffect extends IBaseEffect {
  asset_type: HorizonAssetType;
  asset_code: AssetCode;
  asset_issuer: AccountID;
  limit: string;
}

interface ITrustlineRemovedEffect extends IBaseEffect {
  asset_type: HorizonAssetType;
  asset_code: AssetCode;
  asset_issuer: AccountID;
  limit: string;
}

interface ITrustlineUpdatedEffect extends IBaseEffect {
  asset_type: HorizonAssetType;
  asset_code: AssetCode;
  asset_issuer: AccountID;
  limit: string;
}

interface ITrustlineAuthorizedEffect extends IBaseEffect {
  trustor: AccountID;
  asset_type: HorizonAssetType;
  asset_code?: AssetCode;
}

interface ITrustlineDeauthorizedEffect extends IBaseEffect {
  trustor: AccountID;
  asset_type: HorizonAssetType;
  asset_code?: AssetCode;
}

interface ITradeEffect extends IBaseEffect {
  seller: AccountID;
  offer_id: number;
  sold_amount: string;
  sold_asset_type: HorizonAssetType;
  sold_asset_code?: AssetCode;
  sold_asset_issuer?: AccountID;
  bought_amount: string;
  bought_asset_type: HorizonAssetType;
  bought_asset_code?: AssetCode;
  bought_asset_issuer?: AccountID;
}

export type IHorizonEffectData = IAccountCreatedEffect &
  IAccountCreditedEffect &
  IAccountDebitedEffect &
  IAccountThresholdsUpdatedEffect &
  IAccountHomeDomainUpdatedEffect &
  IAccountFlagsUpdatedEffect &
  ISequenceBumpedEffect &
  ISignerCreatedEffect &
  ISignerRemovedEffect &
  ISignerUpdatedEffect &
  ITrustlineCreatedEffect &
  ITrustlineRemovedEffect &
  ITrustlineUpdatedEffect &
  ITrustlineAuthorizedEffect &
  ITrustlineDeauthorizedEffect &
  ITradeEffect;
