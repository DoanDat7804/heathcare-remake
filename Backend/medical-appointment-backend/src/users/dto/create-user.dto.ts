// src/users/dto/create-user.dto.ts
export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    phone: string;
    dateOfBirth?: Date;
    gender?: string;
    address?: {
      street: string;
      district: string;
      city: string;
      country: string;
    };
    healthInfo?: {
      bloodType: string;
      allergies: string[];
      chronicDiseases: string[];
      currentMedications: string[];
    };
  }