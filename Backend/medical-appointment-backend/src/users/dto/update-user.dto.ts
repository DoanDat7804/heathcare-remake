// src/users/dto/update-user.dto.ts
export class UpdateUserDto {
    name?: string;
    phone?: string;
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
    avatar?: string;
  }