import { IWard } from '../../types/store/service';
import { apiClient } from '../apiClient';

export const getWards = async () => {
  const { data } = await apiClient.get(`/department/ward`);
  return data;
};

export const createWard = async (ward: IWard) => {
  const { data } = await apiClient.post(`/department/ward`, ward);
  return data;
};
