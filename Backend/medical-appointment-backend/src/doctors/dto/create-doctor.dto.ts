export class CreateDoctorDto {
    name: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    specialty: string;
    experience: number;
    languages: string[];
    hospital: {
      name: string;
      address: string;
    };
  }