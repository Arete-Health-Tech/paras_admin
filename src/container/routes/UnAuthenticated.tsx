import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import Landing from '../../screen/landing/Landing';
import Login from '../../screen/login/Login';

type Props = {};

const UnAuthenticated = (props: Props) => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default UnAuthenticated;
