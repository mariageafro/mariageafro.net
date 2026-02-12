export interface PriorityCity {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export const PRIORITY_CITIES: PriorityCity[] = [
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Lyon', country: 'France', lat: 45.7640, lng: 4.8357 },
  { name: 'Marseille', country: 'France', lat: 43.2965, lng: 5.3698 },
  { name: 'Bruxelles', country: 'Belgium', lat: 50.8503, lng: 4.3517 },
  { name: 'Liège', country: 'Belgium', lat: 50.6292, lng: 5.5797 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
];

export const RADIUS_OPTIONS = [
  { label: '20 km', value: 20 },
  { label: '50 km', value: 50 },
  { label: '100 km', value: 100 },
];
