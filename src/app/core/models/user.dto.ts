export interface RegisterRequest {
  name: string;
  surname: string;
  alias: string;
  birth_date: string;
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  name: string;
  surname: string;
  alias: string;
  birth_date: string;
  email: string;
  is_admin: boolean;
}
