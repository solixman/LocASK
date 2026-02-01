import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  constructor(idToken: string) {
    this.idToken = idToken;
  }
}
