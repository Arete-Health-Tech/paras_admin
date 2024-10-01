import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Consumer from '../../screen/support/consumer/Consumer';
import EstimateWidget from '../../screen/support/consumer/EstimateWidget';
import Home from '../../screen/support/home/Home';
import QueryResolution from '../../screen/support/query/QueryResolution';
import QueryRoomSupport from '../../screen/support/query/QueryRoomSupport';
import RegisterConsumer from '../../screen/support/register/RegisterConsumer';
import Search from '../../screen/support/search/Search';
import SupportQueryRoomLayout from '../layout/SupportQueryRoomLayout';
import SupportTabs from '../layout/SupportTabs';

const Support = () => {
  return (
    <Routes>
      <Route path="/" element={<SupportTabs />}>
        <Route index element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<RegisterConsumer />} />
        <Route path="/consumer/:id" element={<Consumer />} />
        <Route path="/query" element={<QueryResolution />} />
        <Route
          path="/consumer/:id/estimate/:prescriptionId"
          element={<EstimateWidget />}
        />
      </Route>
      <Route element={<SupportQueryRoomLayout />}>
        <Route path="query-room/:docId" element={<QueryRoomSupport />} />
      </Route>
    </Routes>
  );
};

export default Support;
