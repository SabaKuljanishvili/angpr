import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/services.service';
import { Departure, Train, Vagon, Seat, TicketRequest } from '../models/models';
import Swal from 'sweetalert2';

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
  selectedVagons: Vagon[] = [];
  email = '';
  phoneNumber = '';
  name = '';
  surname = '';
  idNumber = '';

  constructor(private apiService: ApiService) {}
  

  ngOnInit() {
    this.apiService.getStations().subscribe((data: any) => {
      this.stations = data.map((station: any) => station.name);
    });
  }

  get availableFromStations(): string[] {
    return this.stations.filter(station => station !== this.to);
  }
  
  get availableToStations(): string[] {
    return this.stations.filter(station => station !== this.from);
  }

  onFromStationChange() {
    if (this.from === this.to) {
      this.to = '';
    }
  }

  onToStationChange() {
    if (this.to === this.from) {
      this.from = '';
    }
  }

  searchDepartures() {
    if (!this.from || !this.to || !this.date) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'გთხოვთ, შეავსოთ ყველა საძიებოველი.',
      });
      return;
    }
  
    const selectedDate = new Date(this.date);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
  
    if (selectedDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'არასწორი თარიღი',
        text: 'გთხოვთ, აირჩიოთ მიმდინარე ან მომავალი თარიღი!',
      });
      return;
    }
  
    const formattedDate = new Date(this.date).toISOString();
  
    this.apiService.getDeparture(this.from, this.to, formattedDate).subscribe({
      next: (data: any) => {
        this.trains = data.flatMap((departure: any) => departure.trains);
        if (this.trains.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'მარშუტი არ მოიძებნა',
            text: 'არჩეული მიმართულებისთვის და თარიღისთვის ხელმისაწვდომი მარშუტი არ არის.',
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'გამგზავრების ჩატვირთვა ვერ მოხერხდა. გთხოვთ, სცადოთ მოგვიანებით.',
        });
      }
    });
  }

  selectTrain(train: Train) {
    this.selectedTrain = train;
    this.selectedVagon = null;
    this.selectedSeats = [];
    this.selectedVagons = [];
  
    this.apiService.getVagons(train.id).subscribe({
      next: (data: Vagon[]) => {
        this.filteredVagons = data.filter((vagon) => vagon.trainId === train.id);
  
        if (this.filteredVagons.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'ვაგონები არ მოიძებნა',
            text: 'არჩეული მატარებლისთვის ვაგონები არ არის ხელმისაწვდომი.',
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'შეცდომა',
          text: 'ვაგონების ჩატვირთვა ვერ მოხერხდა. გთხოვთ, სცადოთ მოგვიანებით.',
        });
        console.error('Error fetching vagons:', error);
      }
    });
  }
  
  selectVagon(vagon: Vagon) {
    this.selectedVagon = vagon;
    
    // თუ ეს კლასი ჯერ არ არის დამატებული, დავამატოთ
    if (!this.selectedVagons.some(v => v.id === vagon.id)) {
      this.selectedVagons.push(vagon);
    }
  }

  toggleSeatSelection(seat: Seat) {
    if (!seat.isOccupied) { 
      const index = this.selectedSeats.findIndex((s) => s.seatId === seat.seatId);
      if (index > -1) {
        this.selectedSeats.splice(index, 1);
      } else {
        this.selectedSeats.push(seat);
      }
    }
  }

  getSelectedSeatsForVagon(vagon: Vagon): Seat[] {
    if (!this.selectedSeats || this.selectedSeats.length === 0) return [];
    
    return this.selectedSeats.filter(seat => 
      seat.vagonId === vagon.id
    );
  }

  getTotalPrice(): number {
    return this.selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }

  getSeatRows(): any[][] {
    const rows: any[][] = [];
    if (!this.selectedVagon || !this.selectedVagon.seats) {
      return rows; 
    }
  
    const seats = this.selectedVagon.seats;
  
    for (let i = 0; i < seats.length; i += 8) {
      rows.push(seats.slice(i, i + 8));
    }
  
    return rows;
  }

  registerTicket() {
    if (!this.email || !this.phoneNumber || this.selectedSeats.length === 0 || !this.name || !this.surname || !this.idNumber) {
      Swal.fire({
        icon: 'error',
        title: 'არასრული ინფორმაცია',
        text: 'გთხოვთ, შეავსოთ ყველა სავალდებულო ველი და აირჩიოთ მინიმუმ ერთი ადგილი.',
      });
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
  
    this.apiService.registerTicket(payload).subscribe({
      next: (response: any) => {
        if (response.success || response.status === 'success' || response.bookingId) {
          Swal.fire({
            icon: 'success',
            title: 'წარმატებული დაჯავშნა!',
            text: 'ბილეთები წარმატებით დაჯავშნა.',
            confirmButtonText: 'კარგი'
          }).then(() => {
            this.resetForm();
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'გაფრთხილება',
            text: 'დაჯავშნა შესრულდა, მაგრამ სერვერიდან მოულოდნელი პასუხი მივიღეთ.',
          });
          this.resetForm();
        }
      },
      error: (error) => {
        if (error.status === 200 || error.error?.success) {
          Swal.fire({
            icon: 'success',
            title: 'წარმატებული დაჯავშნა!',
            text: 'ბილეთები წარმატებით დაჯავშნა',
            confirmButtonText: 'კარგი'
          }).then(() => {
            this.resetForm();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'შეცდომა',
            text: 'დაჯავშნის პროცესში მოხდა შეცდომა. გთხოვთ, სცადოთ მოგვიანებით.',
          });
          console.error('Error registering ticket:', error);
        }
      }
    });
  }
  
  resetForm() {
    this.from = '';
    this.to = '';
    this.date = '';
    this.trains = [];
    this.filteredVagons = [];
    this.selectedTrain = null;
    this.selectedVagon = null;
    this.selectedSeats = [];
    this.selectedVagons = [];
    this.email = '';
    this.phoneNumber = '';
    this.name = '';
    this.surname = '';
    this.idNumber = '';
  }
}