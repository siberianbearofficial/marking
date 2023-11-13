export interface User {
  uuid: string;
  username: string;
  isAdmin?: boolean;
  recordsIdList?: string[];
}
