export interface UserModel {
  uuid: string;
  username: string;
  is_admin?: boolean;
  records_id_list?: string[];
}
