export interface Departure {
  id: number;
  source: string;
  destination: string;
  date: string;
  trains: Train[];
}

export interface Train {
  id: number;
  number: number;
  name: string;
  date: string;
  from: string;
  to: string;
  departure: string;
  arrive: string;
  departureId: number;
  vagons: Vagon[] | null;
}

export interface Vagon {
  id: string;
  class: string;
  seats: Seat[];
}

export interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  price: number; // Added price field
}

export interface TicketRequest {
  trainId: number;
  date: string;
  email: string;
  phoneNumber: string;
  people: Passenger[];
}

export interface Passenger {
  seatId: string;
  name: string;
  surname: string;
  idNumber: string;
  status?: string;
  payoutCompleted?: boolean;
}