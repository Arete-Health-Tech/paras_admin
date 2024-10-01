import useServiceStore from '../../store/serviceStore';
import { createDepartment, getDepartments } from './department';

export const getDepartmentsHandler = async (parent?: boolean) => {
  const { setDepartments } = useServiceStore.getState();
  const departments = await getDepartments(parent);
  setDepartments(departments);
};

export const createDepartmentHandler = async (
  name: string,
  parent?: string,
  tags?: string[]
) => {
  await createDepartment(name, parent, tags);
  await getDepartmentsHandler();
};
