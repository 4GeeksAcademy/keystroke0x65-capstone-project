/** The leadership team. Drives both the accessible list and the shipping labels on the 3D conveyor. */
export interface Person {
  name: string;
  role: string;
  /** Office the person works from; empty when not stated. */
  base: string;
  /** Label header colour (one of the service colours). */
  color: string;
}

export const TEAM: readonly Person[] = [
  { name: 'Thomas Harry', role: 'Founder & CEO', base: 'Los Angeles', color: '#FF1F2F' },
  { name: 'Andrés Kim', role: 'CTO', base: 'Zaragoza', color: '#5BC2F0' },
  { name: 'Ana Whitfield', role: 'Warehouse Operations', base: 'Los Angeles & Zaragoza', color: '#8C8CF7' },
  { name: 'Carlos Vega', role: 'Last Mile & Carrier Mgmt', base: '', color: '#FF8A1F' },
  { name: 'Sofía Ramos', role: 'Reverse Logistics', base: '', color: '#5BC2F0' },
  { name: 'Valentina Cruz', role: 'Customer Experience', base: 'Los Angeles & Zaragoza', color: '#FF1F2F' },
  { name: 'Miguel Torres', role: 'Commercial & Client Relations', base: '', color: '#8C8CF7' },
];
