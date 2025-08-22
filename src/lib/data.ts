import type { Equipment } from './types';

export const equipmentData: Equipment[] = [
  {
    id: '1',
    name: 'Industrial 3D Printer',
    model: 'Stratasys F900',
    serialNumber: 'SN-F900-1001',
    purchaseDate: '2022-01-15',
    warrantyEndDate: '2024-01-15',
    status: 'Active',
    imageUrl: 'https://placehold.co/100x100.png',
    operationalHours: 2500,
    failureRate: 0.02,
    contracts: [
      { id: 'c1', provider: 'Stratasys Support', startDate: '2022-01-15', endDate: '2025-01-14', renewalDate: '2024-12-15', terms: 'Full coverage for parts and labor.' },
    ],
    documents: [
      { id: 'd1', name: 'F900 User Manual.pdf', type: 'Manual', uploadDate: '2022-01-15', url: '#' },
      { id: 'd2', name: 'Warranty Certificate.pdf', type: 'Warranty', uploadDate: '2022-01-15', url: '#' },
    ],
    software: [
      { id: 's1', name: 'GrabCAD Print', version: '1.57', licenseKey: 'LICENSE-GC-XYZ', installDate: '2022-01-15' },
    ],
    serviceLogs: [
      { id: 'sl1', date: '2023-07-20', type: 'Preventative', technician: 'John Doe', notes: 'Completed annual preventative maintenance. Replaced print head and calibrated axes.' },
      { id: 'sl2', date: '2024-02-10', type: 'Repair', technician: 'Jane Smith', notes: 'Replaced faulty heating element. System is back online.' },
    ],
  },
  {
    id: '2',
    name: 'CNC Milling Machine',
    model: 'Haas VF-2',
    serialNumber: 'SN-HAAS-2002',
    purchaseDate: '2021-03-20',
    warrantyEndDate: '2023-03-20',
    status: 'Active',
    imageUrl: 'https://placehold.co/100x100.png',
    operationalHours: 5800,
    failureRate: 0.05,
    contracts: [],
    documents: [
      { id: 'd3', name: 'Haas VF-2 Manual.pdf', type: 'Manual', uploadDate: '2021-03-20', url: '#' },
    ],
    software: [
      { id: 's2', name: 'Haas Control Software', version: '11.82', licenseKey: 'N/A', installDate: '2021-03-20' },
    ],
    serviceLogs: [
      { id: 'sl3', date: '2023-09-01', type: 'Preventative', technician: 'Mike Rivera', notes: 'Quarterly maintenance check. Lubricated all moving parts and checked fluid levels.' },
    ],
  },
  {
    id: '3',
    name: 'Lab Spectrometer',
    model: 'Thermo Scientific Nicolet iS50',
    serialNumber: 'SN-TS-3003',
    purchaseDate: '2023-06-01',
    warrantyEndDate: '2025-06-01',
    status: 'In-Repair',
    imageUrl: 'https://placehold.co/100x100.png',
    operationalHours: 800,
    failureRate: 0.01,
    contracts: [
      { id: 'c2', provider: 'Thermo Fisher Scientific', startDate: '2023-06-01', endDate: '2026-05-31', renewalDate: '2026-05-01', terms: 'Gold Support Plan with on-site service.' },
    ],
    documents: [
        { id: 'd4', name: 'Nicolet iS50 Manual.pdf', type: 'Manual', uploadDate: '2023-06-01', url: '#' },
        { id: 'd5', name: 'Purchase Invoice.pdf', type: 'Invoice', uploadDate: '2023-06-01', url: '#' },
    ],
    software: [
      { id: 's3', name: 'OMNIC Software', version: '9.12', licenseKey: 'LICENSE-OMNIC-ABC', installDate: '2023-06-01' },
    ],
    serviceLogs: [
        { id: 'sl4', date: '2024-05-15', type: 'Repair', technician: 'Support Team', notes: 'Laser assembly malfunction. Awaiting replacement part.' },
    ],
  },
];
