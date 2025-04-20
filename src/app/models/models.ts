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
  trainId: number;
  name: string;
  id: string;
  class: string;
  seats: Seat[];
}

export interface Seat {
  vagonId: any;
  id: string; 
  isOccupied: boolean;
  number: string;
  price: number;
  seatId: string; 
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


export interface Ticket {
  id(id: any): unknown;
  ticketId: string;
  trainId: number;
  date: string;
  email: string;
  phoneNumber: string;
  people: Passenger[];
  from?: string;
  to?: string;
  train?: {
    name: string;
    number: number;
  };
}


