import { SortDirection } from '../../../../base/enum/sortBy.enum';

export class GetAllUsersSortData {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
}
