export class BlogViewModelSA {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  blogOwnerInfo: BlogOwnerInfo;
}
class BlogOwnerInfo {
  userId: string;
  userLogin: string;
}
