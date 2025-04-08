import axios from 'axios';

// Base URL for doctor-related API endpoints
const API_URL = '/doctors';

// DTOs for frontend usage
export interface HospitalDto {
  name: string;
  address: string;
  department?: string;
}

export interface CreateDoctorDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  specialty: string;
  experience: number;
  languages: string[];
  hospital?: HospitalDto;
}

export interface DoctorResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  specialty: string;
  experience: number;
  languages: string[];
  hospital?: HospitalDto;
  avatar?: string;
  isActive: boolean;
  role: string;
}

export interface UpdateDoctorDto {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  gender?: string;
  specialty?: string;
  experience?: number;
  languages?: string[];
  hospital?: Partial<HospitalDto>;
  avatar?: string;
}

// API functions

/**
 * Hashes a password via the backend API
 */
export const hashPassword = async (password: string): Promise<string> => {
  const response = await axios.post<string>(`${API_URL}/hash-password`, { password });
  return response.data;
};

/**
 * Creates a new doctor
 */
export const createDoctor = async (
  data: CreateDoctorDto,
): Promise<DoctorResponseDto> => {
  const response = await axios.post<DoctorResponseDto>(API_URL, data);
  return response.data;
};

/**
 * Retrieves all doctors
 */
export const getDoctors = async (): Promise<DoctorResponseDto[]> => {
  try {
    const response = await axios.get<DoctorResponseDto[]>(API_URL);
    if (!Array.isArray(response.data)) {
      console.error("API did not return an array:", response.data);
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error.response?.data || error.message);
    return [];
  }
};

/**
 * Retrieves a single doctor by ID
 */
export const getDoctor = async (
  id: string,
): Promise<DoctorResponseDto> => {
  const response = await axios.get<DoctorResponseDto>(`${API_URL}/${id}`);
  return response.data;
};

/**
 * Updates an existing doctor
 */
export const updateDoctor = async (
  id: string,
  data: UpdateDoctorDto,
): Promise<DoctorResponseDto> => {
  const response = await axios.patch<DoctorResponseDto>(`${API_URL}/${id}`, data);
  return response.data;
};

/**
 * Deletes a doctor by ID
 */
export const deleteDoctor = async (
  id: string,
): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
