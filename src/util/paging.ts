export enum SortOrder {
  DESC = "desc",
  ASC = "asc"
}

export function invertSortOrder(order: SortOrder) {
  if (order === SortOrder.DESC) {
    return SortOrder.ASC;
  }

  return SortOrder.DESC;
}

interface IForwardPagingParams {
  first: number;
  after?: string;
  order?: SortOrder;
}

interface IBackwardPagingParams {
  last: number;
  before?: string;
  order?: SortOrder;
}

export type PagingParams = IForwardPagingParams | IBackwardPagingParams;

export function isForward(paging: PagingParams): paging is IForwardPagingParams {
  return (paging as IForwardPagingParams).first !== undefined;
}

export function parseCursorPagination(args: PagingParams) {
  let limit: number;
  let order: SortOrder = args.order || SortOrder.DESC;
  let cursor: string | undefined;

  if (isForward(args)) {
    limit = args.first;
    cursor = args.after;
  } else {
    limit = args.last;
    cursor = args.before;
    order = invertSortOrder(order);
  }

  return { limit, order, cursor };
}

export function properlyOrdered(records: any[], pagingParams: PagingParams): any[] {
  if (!isForward(pagingParams) && pagingParams.before) {
    return records.reverse();
  }

  return records;
}
