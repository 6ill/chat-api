import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class UserRequestDto {
    @IsNumber()
    id: number;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
}