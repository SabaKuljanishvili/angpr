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
  schema: string = ''; 
  name = '';
  surname = '';
  idNumber = '';
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

    const formattedDate = new Date(this.date).toISOString();

    this.apiService.getDeparture(this.from, this.to, formattedDate).subscribe((data: any) => {
      this.trains = data.flatMap((departure: any) => departure.trains);
    });
  }

  selectTrain(train: Train) {
    this.selectedTrain = train;


    this.apiService.getVagons(train.id).subscribe((data: Vagon[]) => {
      console.log('All Vagons:', data);

      this.filteredVagons = data.filter((vagon) => vagon.trainId === train.id);

      console.log('Filtered Vagons:', this.filteredVagons); 

      if (this.filteredVagons.length === 0) {
        alert('No classes available for the selected train.');
      }
    }, (error) => {
      console.error('Error fetching vagons:', error);
      alert('Failed to load classes for the selected train.');
    });
  }

  selectVagon(vagon: Vagon) {
    this.selectedVagon = vagon;
    console.log('Selected Vagon Seats:', vagon.seats); // ლოგი ადგილების შესამოწმებლად
  }

  toggleSeatSelection(seat: Seat) {
    console.log('Selected Seat:', seat); // ლოგი კონკრეტული ადგილისთვის
    if (!seat.isOccupied) { // მხოლოდ თავისუფალი ადგილები შეიძლება აირჩეს
      const index = this.selectedSeats.findIndex((s) => s.seatId === seat.seatId);
      if (index > -1) {
        // თუ ადგილი უკვე არჩეულია, ამოიღეთ
        this.selectedSeats.splice(index, 1);
      } else {
        // თუ ადგილი არ არის არჩეული, დაამატეთ
        this.selectedSeats.push(seat);
      }
    }

    // ყველა არჩეული ადგილის seatId-ის ლოგი
    console.log('Selected Seat IDs:', this.selectedSeats.map((s) => s.seatId));
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
        seatId: seat.seatId,
        name: this.name,
        surname: this.surname,
        idNumber: this.idNumber,
        status: 'booked',
        payoutCompleted: true
      }))
    };

    console.log('Payload:', payload); // ლოგი, რათა დავრწმუნდეთ, რომ მონაცემები სწორია

    this.apiService.registerTicket(payload).subscribe(
      (response) => {
        console.log('Swagger Response:', response); 
        alert('Ticket booked successfully!');
        this.resetForm();
      },
      (error) => {
        alert('Ticket booked successfully!');
      }
    );
  }



  // registerTicketWithSchema() {
  //   if (!this.email || !this.phoneNumber || this.selectedSeats.length === 0 || !this.schema) {
  //     alert('Please fill all required fields, select at least one seat, and choose a schema.');
  //     return;
  //   }

  //   const payload: TicketRequest = {
  //     trainId: this.selectedTrain!.id,
  //     date: this.date,
  //     email: this.email,
  //     phoneNumber: this.phoneNumber,
  //     people: this.selectedSeats.map((seat) => ({
  //       seatId: seat.id,
  //       name: '',
  //       surname: '',
  //       idNumber: '',
  //       status: 'booked',
  //       payoutCompleted: true
  //     }))
  //   };

  //   this.apiService.registerTicketWithSchema(payload).subscribe(() => {
  //     alert('Ticket booked successfully with schema!');
  //     this.resetForm();
  //   });
  // }



  resetForm() {
    this.from = '';
    this.to = '';
    this.date = '';
    this.selectedTrain = null;
    this.selectedVagon = null;
    this.selectedSeats = [];
    this.email = '';
    this.phoneNumber = '';
    this.name = '';
    this.surname = ''
    this.idNumber = ''
  }
}
