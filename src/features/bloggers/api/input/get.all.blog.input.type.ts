import { SortDirection } from '../../../../base/enum/sortBy.enum';

export class GetBlogInput {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
}
