import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';

export class SignUpErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  @Input() isVisible: boolean;
  @Output() toggleVisibility = new EventEmitter();

  hide = true;
  hideAgain = true;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  passwordAgainFormControl = new FormControl('', [
    Validators.required
  ]);

  emailMatcher = new SignUpErrorStateMatcher();
  passwordMatcher = new SignUpErrorStateMatcher();
  passwordAgainMatcher = new SignUpErrorStateMatcher();

  constructor (private _authService: AuthService, private _snackBar: MatSnackBar) {}

  handleMouseClick (event) {
    if (event.srcElement.className.includes('sign-up-wrapper') ||
      event.srcElement.className.includes('close-icon')) {
      this.toggleVisibility.emit();
    }
  }

  signUp () {
    this._authService.signUp(this.emailFormControl.value, this.passwordFormControl.value)
      .subscribe(
        data => {
          if (!data.error) {
            let snackBarRef = this._snackBar.open('Signed up successfully!', '', {
              duration: 800
            });
            this.toggleVisibility.emit();
            this.emailFormControl.reset();
            this.passwordFormControl.reset();
            this.passwordAgainFormControl.reset();
          }
        },
        error => {
          console.log(error);
        },
        () => {
          // console.log('Complete');
        }
      );
  }

  isBtnDisabled () {
    return this.emailFormControl.hasError('email')
      || this.emailFormControl.hasError('required')
      || this.passwordFormControl.hasError('required')
      || this.passwordAgainFormControl.hasError('required')
      || this.passwordFormControl.value !== this.passwordAgainFormControl.value;
  }
}
