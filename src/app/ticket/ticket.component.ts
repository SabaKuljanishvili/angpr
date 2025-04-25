import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/services.service';

@Component({
  selector: 'app-ticket',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {
  name: string = '';
  surname: string = '';
  idNumber: string = '';
  tickets: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  debugMode: boolean = true; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  searchTickets(): void {
    if (!this.name || !this.surname || !this.idNumber) {
      this.errorMessage = 'გთხოვთ შეავსოთ ყველა ველი';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.apiService.getTicketsByPassenger(this.name, this.surname, this.idNumber)
      .subscribe({
        next: (data: any) => {
          let rawTickets = [];
          
          if (Array.isArray(data)) {
            rawTickets = data;
          } else if (data && typeof data === 'object') {
            if (Object.keys(data).some(key => !isNaN(Number(key)))) {
              rawTickets = Object.values(data);
            } else {
              rawTickets = [data];
            }
          }
          
          this.tickets = rawTickets.filter(ticket => {
            if (Array.isArray(ticket.people) || Array.isArray(ticket.persons)) {
              const passengers = ticket.people || ticket.persons;
              return passengers.some((passenger: { name: string; surname: string; idNumber: string; }) => 
                passenger.name?.toLowerCase() === this.name.toLowerCase() &&
                passenger.surname?.toLowerCase() === this.surname.toLowerCase() &&
                passenger.idNumber === this.idNumber
              );
            }
            
            return (
              (ticket.name?.toLowerCase() === this.name.toLowerCase() ||
               ticket.passengerName?.toLowerCase() === this.name.toLowerCase()) &&
              (ticket.surname?.toLowerCase() === this.surname.toLowerCase() ||
               ticket.passengerSurname?.toLowerCase() === this.surname.toLowerCase()) &&
              (ticket.idNumber === this.idNumber ||
               ticket.passengerIdNumber === this.idNumber)
            );
          });
          
          this.isLoading = false;
          if (this.tickets.length === 0) {
            this.errorMessage = 'ბილეთები ვერ მოიძებნა';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching tickets:', error); 
          this.isLoading = false;
          
          if (error.status === 500) {
            this.errorMessage = 'სერვერის შეცდომა: შეუძლებელია ბილეთების მოძიება';
          } else if (error.status === 404) {
            this.errorMessage = 'ბილეთები ვერ მოიძებნა';
          } else {
            this.errorMessage = 'შეცდომა ბილეთების მოძიებისას: ' + 
              (error.error?.message || error.message || 'უცნობი შეცდომა');
          }
          
          this.tickets = [];
        }
      });
  }

  // cancelTicket(ticketId: string): void {
  //   if (!ticketId || ticketId === 'უცნობი ID') {
  //     this.errorMessage = 'არასწორი ბილეთის ID';
  //     return;
  //   }
  
  //   if (confirm('ნამდვილად გსურთ ბილეთის გაუქმება?')) {
  //     this.isLoading = true;
  //     this.errorMessage = '';
  //     this.successMessage = '';
      
  //     this.apiService.cancelTicket(ticketId)
  //       .subscribe({
  //         next: (response: any) => {
  //           this.handleCancellationSuccess(ticketId, response);
  //         },
  //         error: (error: HttpErrorResponse) => {
  //           if (error.status === 200) {
  //             this.handleCancellationSuccess(ticketId, error.error);
  //           } else {
  //             this.handleCancellationError(error);
  //           }
  //         }
  //       });
  //   }
  // }
  
  private handleCancellationSuccess(ticketId: string, response: any): void {
    // console.log('Ticket canceled successfully:', response);
    this.successMessage = 'ბილეთი წარმატებით გაუქმდა';
    this.tickets = this.tickets.filter(ticket => 
      this.getTicketId(ticket) !== ticketId
    );
    this.isLoading = false;
  }
  
  // private handleCancellationError(error: HttpErrorResponse): void {
  //   console.error('Error canceling ticket:', error);
  //   this.isLoading = false;
    
  //   if (error.status === 500) {
  //     this.errorMessage = 'სერვერის შეცდომა: შეუძლებელია ბილეთის გაუქმება';
  //   } else if (error.status === 404) {
  //     this.errorMessage = 'ბილეთი ვერ მოიძებნა';
  //   } else {
  //     this.errorMessage = 'შეცდომა ბილეთის გაუქმებისას: ' + 
  //       (error.error?.message || error.message || 'უცნობი შეცდომა');
  //   }
  // }


  formatDate(dateString: string): string {
    if (!dateString) return 'არასწორი თარიღი';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; 
      
      return date.toLocaleDateString('ka-GE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString; 
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
  
  getNestedValue(obj: any, path: string, defaultValue: any = 'N/A'): any {
    if (!obj) return defaultValue;
    const keys = path.split('.');
    return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : defaultValue, obj);
  }
  
  getTicketId(ticket: any): string {
    return ticket.ticketId || ticket.id || 'უცნობი ID';
  }
  
  getTrainName(ticket: any): string {
    if (ticket.train?.name) {
      return ticket.train.name;
    } else if (ticket.trainId) {
      return `მატარებელი #${ticket.trainId}`;
    } else if (ticket.train) {
      return `მატარებელი #${ticket.train}`;
    }
    return 'N/A';
  }
  
  getTrainNumber(ticket: any): string {
    if (ticket.train?.number) {
      return `№${ticket.train.number}`;
    } else if (ticket.trainID) {
      return `№${ticket.trainID}`;
    }
    return '';
  }
  
  getPassengers(ticket: any): any[] {
    if (Array.isArray(ticket.people)) {
      return ticket.people;
    } else if (ticket.persons && Array.isArray(ticket.persons)) {
      return ticket.persons;
    }
    return [];
  }
}