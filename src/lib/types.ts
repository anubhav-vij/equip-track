
export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyEndDate: string;
  status: 'Active' | 'In-Repair' | 'Decommissioned';
  imageUrl: string;
  contracts: ServiceContract[];
  documents: Document[];
  software: Software[];
  serviceLogs: ServiceLog[];
  room: string;
  department: string;
  manufacturer: string;
  nciNumber: string;
  nihNumber: string;
  transferred: boolean;
  poc: string;
  notes: string;
  purchasingAmbisPoNumber: string;
  installedDate: string;
  node?: string;
  probe?: string;
  onNetwork: boolean;
  computerAssociated?: string;
  hasServiceContract: boolean;
}

export interface ServiceContract {
  id: string;
  provider?: string; 
  startDate?: string;
  endDate?: string;
  terms?: string;
  renewalDate?: string;
  numberOfPreventativeMaintenance?: number;
  preventativeMaintenanceDoneDate?: string;
  preventativeMaintenanceDueDate?: string;
  poStartDate?: string;
  poEndDate?: string;
  poNumber?: string;
  poLineNumber?: string;
  annualCost?: number;
  creditUnusedCoverage?: boolean;
  vendorPoc?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'Manual' | 'Warranty' | 'Invoice' | 'Other';
  uploadDate: string;
  url: string;
}

export interface Software {
  id:string;
  name: string;
  version: string;
  licenseKey: string;
  installDate: string;
  expirationDate?: string;
}

export type ServiceLogStatus = 'Requested' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';

export interface ServiceLog {
  id: string;
  date: string;
  type: 'Preventative' | 'Repair' | 'Inspection' | 'Request';
  technician: string;
  notes: string;
  status: ServiceLogStatus;
}
