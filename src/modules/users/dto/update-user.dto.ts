import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'Новое имя пользователя', required: false, example: 'new_username' })
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'Новый email', required: false, example: 'new@email.com' })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Новый пароль', required: false, example: 'newPassword123' })
  @IsOptional()
  password?: string;
}
