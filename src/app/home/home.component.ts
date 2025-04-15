import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/services.service';
import { Departure, Train, Vagon, Seat, TicketRequest } from '../models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  {
  stations: string[] = [];
  trains: Train[] = [];
  vagons: Vagon[] = [];
  filteredVagons: Vagon[] = [];
  from = '';
  to = '';
  date = '';
  selectedTrain: Train | null = null;
  selectedVagon: Vagon | null = null;
  selectedSeats: Seat[] = [];
  email = '';
  phoneNumber = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Load stations
    this.apiService.getStations().subscribe((data: any) => {
      this.stations = data.map((station: any) => station.name);
    });
  }

  searchDepartures() {
    if (!this.from || !this.to || !this.date) {
      alert('Please select all fields.');
      return;
    }

    // Fetch trains based on selected stations and date
    this.apiService.getDeparture(this.from, this.to, this.date).subscribe((data: any) => {
      this.trains = data.flatMap((departure: any) => departure.trains);
    });
  }

  selectTrain(train: Train) {
    this.selectedTrain = train;

    // Fetch vagons for the selected train
    this.apiService.getVagons(train.id).subscribe((data: Vagon[]) => {
      this.vagons = data;

      // Filter vagons based on the selected train's ID
      this.filteredVagons = this.vagons.filter((vagon) => vagon.id === train.id.toString());
    });
  }

  selectVagon(vagon: Vagon) {
    this.selectedVagon = vagon;
  }

  toggleSeatSelection(seat: Seat) {
    if (seat.isAvailable) {
      const index = this.selectedSeats.findIndex((s) => s.id === seat.id);
      if (index > -1) {
        this.selectedSeats.splice(index, 1);
      } else {
        this.selectedSeats.push(seat);
      }
    }
  }

  registerTicket() {
    if (!this.email || !this.phoneNumber || this.selectedSeats.length === 0) {
      alert('Please fill all required fields and select at least one seat.');
      return;
    }

    const payload: TicketRequest = {
      trainId: this.selectedTrain!.id,
      date: this.date,
      email: this.email,
      phoneNumber: this.phoneNumber,
      people: this.selectedSeats.map((seat) => ({
        seatId: seat.id,
        name: '',
        surname: '',
        idNumber: '',
        status: 'booked',
        payoutCompleted: true
      }))
    };

    this.apiService.registerTicket(payload).subscribe(() => {
      alert('Ticket booked successfully!');
      this.resetForm();
    });
  }

  resetForm() {
    this.from = '';
    this.to = '';
    this.date = '';
    this.selectedTrain = null;
    this.selectedVagon = null;
    this.selectedSeats = [];
    this.email = '';
    this.phoneNumber = '';
  }
}
