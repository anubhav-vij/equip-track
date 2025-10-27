
export type UserRole = 'admin' | 'user';

export type PropertyTag = {
  id: string;
  type: 'NCI' | 'NIH' | 'VPP';
  value: string;
};

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyEndDate: string;
  status: 'Active' | 'In-Repair' | 'Decommissioned' | 'Out of Service';
  imageUrl: string;
  contracts: ServiceContract[];
  documents: Document[];
  software: Software[];
  serviceLogs: ServiceLog[];
  room: string;
  department: string;
  manufacturer: string;
  propertyTags: PropertyTag[];
  transferred: boolean;
  poc: string;
  notes: string;
  purchasingAmbisPoNumber: string;
  installedDate: string;
  reesNodeProbe?: string;
  ups?: string;
  onNetwork: boolean;
  computerAssociated?: string;
  hasServiceContract: boolean;
  lastCertificationDate?: string;
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
  type: 'Preventative' | 'Repair' | 'Inspection' | 'Request' | 'Certification';
  technician: string;
  notes: string;
  status: ServiceLogStatus;
}
