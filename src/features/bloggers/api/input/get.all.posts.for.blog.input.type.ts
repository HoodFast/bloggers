import { SortDirection } from '../../../../base/enum/sortBy.enum';

export class GetPostForBlogInput {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
}
