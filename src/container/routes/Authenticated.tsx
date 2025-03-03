import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../../screen/dashboard/Dashboard';
import Department from '../../screen/department/Department';
import Doctor from '../../screen/doctor/Doctor';
import DashboardLayout from '../layout/DashboardLayout';
import DepartmentLayout from '../layout/DepartmentLayout';
import TicketLayout from '../layout/TicketLayout';
import Services from '../../screen/services/Services';
import Wards from '../../screen/wards/Wards';
import SingleTicketDetails from '../../screen/ticket/SingleTicketDetails';
import Tags from '../../screen/tags/Tags';
import Stage from '../../screen/stage/Stage';
import Script from '../../screen/script/Script';
import Flow from '../../screen/flow/Flow';
import NodeConnector from '../../screen/flow/widgets/NodeConnector';
import NodeReplies from '../../screen/flow/NodeReplies';
import NodeList from '../../screen/flow/NodeList';
import Dump from '../../screen/script/Dump';
import NSingleTicketDetails from '../../screen/ticket/NSingleTicketDetails';
import Navbar from '../../screen/Navbar/Navbar';
import OrderListBody from '../../screen/orders/OrderListBody';
import OrderDetailContainer from '../../screen/orders/orderDetailPage/OrderDetailContainer';
import AuditSinglePageDetail from '../../screen/audit/AuditSinglePage/AuditSinglePageDetail';
import SwitchViewTable from '../../screen/ticket/switchView/SwitchViewTable';
import AgentLogin from '../../screen/agent/AgentLogin';
import FileUpload from '../../screen/fileUpload/fileUpload';
import ConfigurationBar from '../../screen/configuration/ConfigurationBar';
import Configuration from './Configuration';


type Props = {};

const Authenticated = (props: Props) => {
  return (
    <>
      {/* <AgentLogin> */}
        <Navbar>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="department" element={<DepartmentLayout />}>
                <Route index element={<Department />} />
              </Route>
              <Route path="doctors" element={<Doctor />} />
              <Route path="wards" element={<Wards />} />
              <Route path="services" element={<Services />} />
              <Route path="scripts" element={<Script />} />
              <Route path="tags" element={<Tags />} />
              <Route path="stages" element={<Stage />} />
              <Route path="flow" element={<Flow />} />
              <Route path="connector" element={<NodeConnector />} />
              <Route path="node-replies" element={<NodeReplies />} />
              <Route path="node-lists" element={<NodeList />} />
            </Route>
            <Route path="admission" element={<TicketLayout />}>
              {/* <Route path=":ticketID" element={<SingleTicketDetails />} /> */}
              <Route path=":ticketID" element={<NSingleTicketDetails />} />
            </Route>
            <Route path="diagnostics" element={<TicketLayout />}>
              <Route path=":ticketID" element={<NSingleTicketDetails />} />
            </Route>
            <Route path="follow-up" element={<TicketLayout />}>
              <Route path=":ticketID" element={<NSingleTicketDetails />} />
            </Route>
            {/* <Route path="tickets" element={<TicketLayout />} /> */}
            <Route path="dump" element={<Dump />} />
            <Route path="/OrderList" element={<OrderListBody />} />
            <Route
              index
              path="OrderList/orderDetails/:uid"
              element={<OrderDetailContainer />}
            />
            <Route
              index
              path="/switchView"
              element={<SwitchViewTable />}
            />
            <Route
              index
              path="/switchView/:ticketID"
              element={<NSingleTicketDetails />}
            />
            <Route path="upload-file" element={<FileUpload />} />
            <Route path="configuration/*" element={<Configuration />} />
          </Routes>
        </Navbar>
      {/* </AgentLogin> */}
    </>
  );
};

export default Authenticated;
