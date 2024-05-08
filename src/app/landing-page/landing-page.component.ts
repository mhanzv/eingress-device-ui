import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef;
  isHidden: boolean = false;
  rfidInput: string = '';

  constructor(private employeeService: EmployeeService, private router: Router) {
    // Focus on the input textbox when the component is initialized
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    });
  }

  @HostListener('document:click', ['$event'])

  onClick(event: MouseEvent) {
    // Focus on the input textbox whenever a click event occurs on the document
    this.inputElement.nativeElement.focus();
  
    // Prevent the default behavior of the click event to ensure the input textbox remains focused
    event.preventDefault();
  }
  // onInput(event: Event): void {
  //   // Log the typed input to the console
  //   console.log('Typed input:', (event.target as HTMLInputElement).value);
  // }

onFocus(): void{
  this.isHidden = false;
}

// onBlur(): void{
// setTimeout(() => {
//   this.isHidden = false;
// })
// }


submitData(): void {
  // Perform data submission logic here
  this.rfidInput = this.inputElement.nativeElement.value;
  if(this.rfidInput.trim() !== ''){
    this.employeeService.loginEmployee(this.rfidInput).subscribe({
      next: (response: any) => {
        console.log('Employee access logged successfully:', response);
      },
      error: (error:any) => {
        console.error('Error logging employee access:', error);
        // Check if the error is due to employee not found
        if (error.status === 400 && error.error && error.error.message === 'Employee not found') {
          // Handle employee not found error here, e.g., show a message to the user
          console.error('Employee not found.');
        } else {
          // Handle other errors, e.g., show a generic error message to the user
          console.error('An error occurred while logging employee access.');
        }
      }
    })
  }


  this.inputElement.nativeElement.value = '';
  this.inputElement.nativeElement.focus();
}

}
