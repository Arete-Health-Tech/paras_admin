import useServiceStore from '../../store/serviceStore';
import { IWard } from '../../types/store/service';
import { createWard, getWards } from './ward';

export const getWardsHandler = async () => {
  const { setWards } = useServiceStore.getState();
  const wards = await getWards();
  setWards(wards);
};

export const createWardHandler = async (ward: IWard) => {
  const { setWards, wards } = useServiceStore.getState();
  const addedWard = await createWard(ward);
  setWards([...wards, addedWard]);
};
