import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../services/services.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-ticket',
  standalone: true,
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

  // PDF გენერირება
  async downloadTicketAsPdf(ticket: any) {
    this.isLoading = true;
    try {
      // იპოვეთ ბილეთის ელემენტი
      const ticketElement = document.querySelector(`.ticket-item`);
      
      if (!ticketElement) {
        throw new Error('ბილეთის ელემენტი ვერ მოიძებნა');
      }

      // HTML გადაიყვანეთ canvas-ში
      const canvas = await html2canvas(ticketElement as HTMLElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      // შექმენით PDF დოკუმენტი
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 სიგანე
      const pageHeight = 295; // A4 სიმაღლე
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // დამატებითი გვერდები თუ საჭიროა
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF-ის შენახვა
      pdf.save(`ბილეთი_${this.getTicketId(ticket)}.pdf`);
    } catch (error) {
      console.error('PDF გენერირების შეცდომა:', error);
      this.errorMessage = 'PDF გენერირებისას მოხდა შეცდომა';
    } finally {
      this.isLoading = false;
    }
  }

  // დამხმარე ფუნქციები
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