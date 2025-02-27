import { iDepartment, iDoctor } from './service';

export interface iConsumer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  dob: string;
  gender: 'M' | 'F' | 'O';
  uid: string;
  address: {
    house: string;
    city: string;
    state: string;
    postalCode: string;
  };
  uhid: string;
}

// export interface iEstimate {
//   type: number;
//   isEmergency: boolean;
//   wardDays: number;
//   icuDays: number;
//   icuType: string;
//   paymentType: number;
//   insuranceCompany: string;
//   insurancePolicyNumber: string;
//   insurancePolicyAmount: number;
//   service: serviceAdded[];
//   investigation: string[];
//   procedure: string[];
//   investigationAmount: number;
//   procedureAmount: number;
//   medicineAmount: number;
//   equipmentAmount: number;
//   bloodAmount: number;
//   additionalAmount: number;
//   prescription: string;
//   ticket: string | undefined;
//   creator?: string;
//   total?: number;
//   createdAt?: Date;
// }

export interface iEstimate {
  type: number;
  isEmergency: boolean;
  wardDays: number;
  icuDays: number;
  ward: string;
  paymentType: number;
  insuranceCompany: string | null;
  insurancePolicyNumber: number | null;
  insurancePolicyAmount: number;
  service: serviceAdded[];
  // investigation: string[];
  // procedure: string[];
  mrd: number;
  pharmacy: number;
  pathology: number;
  equipmentAmount: number;
  diet: number;
  admission: number;
  prescription: Object;
  ticket: string | undefined;
  creator?: string;
  total?: number;
  createdAt?: Date;
}

export interface iPrescrition {
  _id: string;
  admission: null | string;
  service?: iService;
  condition: string;
  consumer: string;
  departments: string[];
  diagnostics: null;
  medicines: string[];
  doctor: string;
  followUp: string;
  image: string;
  image1: string;
  symptoms: string;
  remark: string | '';
}

export interface phoneData {
  recording: string | null;
  ticketid: string;
  time: string;
  _id: string;
  Date?: Date | null | undefined;
}
export interface opinionData {
  additionalInfo: string;
  doctor: string;
  hospital: string;
  ticketid: string;
  type: string;
  challengeSelected: string[] | [];
  _id: string;
}

export interface iAuditorcomment {
  _id: string;
  comments: string;
  ratings: number;
  ticketid: string;
  result: string;
  Date?: Date | null | undefined;
}

export interface iEstimateUpload {
  _id: string;
  location: string;
  total: Number;
  ticket: string;
  creator: string;
  paymentType: string;
}
export interface iTicket {
  _id: string;
  consumer: iConsumer[];
  prescription: iPrescription[];
  estimate: iEstimate[];
  estimateupload: iEstimateUpload[] | [];
  creator: string;
  auditorcomment: iAuditorcomment[];
  assigned: iAssigned[];
  date: string;
  stage: string;
  location: string;
  createdAt: string;
  creator: iCreator[];
  // ..
  isNewTicket: boolean | true;
  subStageCode: {
    active: boolean;
    code: number;
  };
  result: string;
  modifiedDate: Date | string | null;
  won: string;
  loss: string;
  pharmacyStatus: string;
  phoneData: phoneData[];
  opinion: opinionData[];
  lastActivity: string | null;
  Probability: number;
  status: string;
  specialty: string;
}

export interface iPharmcyTicket {
  _id: string;
  consumer: iConsumer[];
  prescription: iPrescription[];
  estimate: iEstimate[];
  creator: string;
  assigned: iAssigned[];
  stage: string;
  location: string;
  createdAt: string;
  creator: iCreator[];
  // ..
  isNewTicket: boolean | true;
  subStageCode: {
    active: boolean;
    code: number;
  };
  modifiedDate: Date | string | null;
  won: string;
  loss: string;
  pharmacyStatus: string;
}

export interface iTicketStore {
  tickets: iTicket[];
  setTickets: (tickets: iTicket[]) => void;
  pharmcyTicket: iPharmcyTicket[];
  setPharmcyTickets: (tickets: iPharmcyTicket[]) => void;
  ticketCount: number;
  setTicketCount: (count: number) => void;
  searchByName: string;
  setSearchByName: (name: string) => void;
  ticketCache: any;
  setTicketCache: (ticketCache: any) => void;
  emptyDataText: string;
  setEmptyDataText: (emptyDataText: string) => void;
  downloadTickets: iTicket[];
  setDownloadTickets: (downloadTickets: iTicket[]) => void;
  notes: iNote[];
  setNotes: (notes: iNote[]) => void;
  reminders: iReminder[];
  setReminders: (reminders: iReminder[]) => void;
  callRescheduler: iCallRescheduler[];
  setCallRescheduler: (callRescheduler: iCallRescheduler[]) => void;
  filterTickets: iTicketFilter;
  setFilterTickets: (filterTickets: iTicketFilter) => void;
  filterTicketsDiago: iTicketFilter;
  setFilterTicketsDiago: (filterTicketsDiago: iTicketFilter) => void;
  filterTicketsFollowUp: iTicketFilter;
  setFilterTicketsFollowUp: (filterTicketsFollowUp: iTicketFilter) => void;
  loaderOn: boolean;
  setLoaderOn: (loaderOn: boolean) => void;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  estimates: iEstimate[];
  setEstimates: (estimates: iEstimate[]) => void;
  viewEstimates: iEstimate2[];
  setViewEstimates: (viewEstimates: iEstimate2) => void;
  status: iTimer[];
  setStatus: (status: iTimer[]) => void;
  pharmacyDateFilter: date;
  setPharmacyDateFilter: (pharmacyDateFilter: date) => void;
  pharmacyOrderStatusFilter: string;
  setPharmacyOrderStatusFilter: (pharmacyOrderStatusFilter: string) => void;
  pharmacySearchFilter: string;
  setPharmacySearchFilter: (pharmacySearchFilter: string) => void;
  pharmacyOrderPendingCount: string;
  setPharmacyOrderPendingCount: (pharmacyOrderPendingCount: string) => void;
  pharmacyOrderReadyCount: string;
  setPharmacyOrderReadyCount: (pharmacyOrderReadyCount: string) => void;
  pharmacyOrderCompletedCount: string;
  setPharmacyOrderCompletedCount: (pharmacyOrderCompletedCount: string) => void;
  pharmacyOrderCancelledCount: string;
  setPharmacyOrderCancelledCount: (pharmacyOrderCancelledCount: string) => void;
  whtsappExpanded: boolean;
  setWhtsappExpanded: (whtsappExpanded: boolean) => void;
  smsModal: boolean;
  setSmsModal: (smsModal: boolean) => void;
  phoneModal: boolean;
  setPhoneModal: (phoneModal: boolean) => void;
  noteModal: boolean;
  setNoteModal: (noteModal: boolean) => void;
  ticketUpdateFlag: object;
  setTicketUpdateFlag: (ticketUpdateFlag: object) => void;
  isModalOpenCall: boolean;
  setIsModalOpenCall: (isModalOpenCall: boolean) => void;
  isAuditor: boolean;
  setIsAuditor: (isAuditor: boolean) => void;
  isSwitchView: boolean;
  setIsSwitchView: (isSwitchView: boolean) => void;
  isAuditorFilterOn: boolean;
  setIsAuditorFilterOn: (isAuditorFilterOn: boolean) => void;
  isEstimateUpload: boolean;
  setIsEstimateUpload: (isEstimateUpload: boolean) => void;
  allTaskCount: iTaskCount[];
  setAllTaskCount: (allTaskCount: iTaskCount[]) => void;
  allAuditCommentCount: iAllAuditComment;
  setAllAuditCommentCount: (allAuditCommentCount: iAllAuditComment) => void;
  agentLogin: boolean;
  setAgentLogin: (agentLogin: boolean) => void;
  allWhtsappCount: object;
  setAllWhtsappCount: (allWhtsappCount: object) => void;
  filteredLocation: string;
  setFilteredLocation: (filteredLocation: string) => void;

  // Audit Filter Variable
  auditFilterCount: number;
  setAuditFilterCount: (auditFilterCount: number) => void;
  auditStage: string;
  setAuditStage: (auditStage: string) => void;
  auditStatus: string;
  setAuditStatus: (auditStatus: string) => void;
  auditResult: string;
  setAuditResult: (auditResult: string) => void;
  auditDateRange: string[];
  setAuditDateRange: (auditDateRange: string[]) => void;
  ticketType: string;
  setTicketType: (ticketType: string) => void;
  downloadDisable: boolean;
  setDownloadDisable: (downloadDisable: boolean) => void;
  clearToChangeTicket: boolean;
  setClearToChangeTicket: (clearToChangeTicket: boolean) => void;
  dashboardLoader: boolean;
  setDashboardLoader: (dashboardLoader: boolean) => void;
  dashboardLoaderAdmission: boolean;
  setDashboardLoaderAdmission: (dashboardLoaderAdmission: boolean) => void;
}

export interface iNote {
  text: string;
  ticket: string;
  createdAt?: number;
  creator?: string;
  ucid?: string;
  _id?: string;
  stoppedTimer?: number | null;
}

export interface iTimer {
  select: string;
  stoppedTimer?: number | null | undefined;
}

export interface iTaskCount {
  ticketId: string;
  totalCount: number;
}
export interface iReminder {
  _id?: string;
  date: number;
  title: string;
  description: string;
  ticket: string | undefined;
  ticketType?: string;
  creator?: string;
}

export interface iCallRescheduler {
  _id?: string;
  date: number;
  title: string;
  description: string;
  ticket: string | undefined;
  creator?: string;
  ticketType?: string;
  selectedLabels: SelectedLabel[];
  reason: string;
}
interface SelectedLabel {
  label: string;
}

export interface iTicketFilter {
  stageList: any[];
  representative: string | null;
  admissionType?: string[];
  diagnosticsType?: string[];
  startDate?: number;
  endDate?: number;
  dateRange: string[];
  results?: string | null;
  status: string[];
  followUp: Date | null;
}
export interface iAllAuditComment {
  auditorCommentId: string;
  ticketid: string;
  unreadCount: object;
}
export interface iCreator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
}
export interface iAssigned {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
}
