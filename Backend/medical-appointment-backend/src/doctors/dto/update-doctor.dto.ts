export class UpdateDoctorDto {
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    specialty?: string;
    experience?: number;
    languages?: string[];
    hospital?: {
      name: string;
      address: string;
    };
    avatar?: string;
  }