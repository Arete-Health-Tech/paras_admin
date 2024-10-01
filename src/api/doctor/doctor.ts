import { apiClient } from '../apiClient';

export const getDoctors = async () => {
  const { data } = await apiClient.get(
    `/department/doctor?department&subDepartment`
  );
  return data;
};

export const createNewDoctor = async (doctor: any) => {
  const { data } = await apiClient.post(`/department/doctor`, doctor);
  return data;
};
