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
}

export interface ServiceContract {
  id: string;
  provider: string;
  startDate: string;
  endDate: string;
  terms: string;
  renewalDate: string;
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
}

export interface ServiceLog {
  id: string;
  date: string;
  type: 'Preventative' | 'Repair' | 'Inspection';
  technician: string;
  notes: string;
}
