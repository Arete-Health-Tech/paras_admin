import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getDepartmentsHandler } from '../../api/department/departmentHandler';

type Props = {};

const DepartmentLayout = (props: Props) => {
  useEffect(() => {
    (async function () {
      await getDepartmentsHandler();
    })();
  }, []);
  return <Outlet />;
};

export default DepartmentLayout;
