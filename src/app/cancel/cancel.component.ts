import { Component, NgModule } from '@angular/core';
import { ApiService } from '../services/services.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Passenger } from '../models/models';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.scss'
})
export class CancelComponent {
  ticketForm: FormGroup;
  verificationForm: FormGroup;
  ticket: any = null;
  ticketFound = false;
  verificationSuccess = false;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.ticketForm = this.fb.group({
      ticketId: ['', [Validators.required]]
    });

    this.verificationForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      idNumber: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  searchTicket(): void {
    if (this.ticketForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.ticket = null;
    this.ticketFound = false;
    this.verificationSuccess = false;

    const ticketId = this.ticketForm.get('ticketId')?.value;
    
    this.apiService.getTicket(ticketId).subscribe({
      next: (response) => {
        this.ticket = response;
        this.ticketFound = true;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'ბილეთი ვერ მოიძებნა. გთხოვთ შეამოწმოთ ბილეთის ნომერი.';
        this.loading = false;
      }
    });
  }

  verifyPassenger(): void {
    if (this.verificationForm.invalid) {
      return;
    }

    this.errorMessage = '';
    const name = this.verificationForm.get('name')?.value;
    const surname = this.verificationForm.get('surname')?.value;
    const idNumber = this.verificationForm.get('idNumber')?.value;

    // Check if any passenger in the ticket matches the provided details
    const matchingPassenger = this.ticket.people.find((passenger: Passenger) => 
      passenger.name.toLowerCase() === name.toLowerCase() &&
      passenger.surname.toLowerCase() === surname.toLowerCase() &&
      passenger.idNumber === idNumber
    );

    if (matchingPassenger) {
      this.verificationSuccess = true;
    } else {
      this.errorMessage = 'მგზავრის მონაცემები არ ემთხვევა ბილეთის მონაცემებს.';
    }
  }

  cancelTicket(): void {
    if (!this.verificationSuccess || !this.ticket) {
      return;
    }

    this.loading = true;
    const ticketId = this.ticketForm.get('ticketId')?.value;

    this.apiService.cancelTicket(ticketId).subscribe({
      next: (response) => {
        this.successMessage = 'ბილეთი წარმატებით გაუქმდა.';
        this.resetForms();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'ბილეთის გაუქმება ვერ მოხერხდა. გთხოვთ სცადოთ მოგვიანებით.';
        this.loading = false;
      }
    });
  }

  resetForms(): void {
    this.ticketForm.reset();
    this.verificationForm.reset();
    this.ticket = null;
    this.ticketFound = false;
    this.verificationSuccess = false;
    this.errorMessage = '';
  }
}
