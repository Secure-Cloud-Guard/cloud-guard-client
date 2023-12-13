import { Component, ViewChild } from '@angular/core';
import { MatStepper } from "@angular/material/stepper";
import { CognitoService } from "@modules/auth/services";
import { AlertService, AppRoutes, ThemeColorService } from "@globalShared";
import { SignUpSteps } from "@modules/auth/types";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent {
  email: string = "";
  password: string = "";
  hide: boolean = true;

  steps: SignUpSteps = {
    signUp: false,
    fillCode: false,
    login: false
  };

  protected readonly AppRoutes = AppRoutes;
  @ViewChild('stepper') private stepper?: MatStepper;

  constructor(
    private alertService: AlertService,
    private cognitoService: CognitoService,
    protected readonly themeColorService: ThemeColorService
  ) { }

  onSignUp(event: Event|MouseEvent) {
    event.preventDefault();

    this.cognitoService.signUp({ username: this.email, password: this.password }).then((response) => {
      const { nextStep } = response;

      if (nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
        this.alertService.success("The code was sent to the email address " + nextStep?.codeDeliveryDetails?.destination);
        this.steps.signUp = true;
        this.stepperNext();
      }
    })
  }

  onCodeCompleted(code: string) {
    this.cognitoService.signUpConfirmation({ username: this.email, confirmationCode: code }).then(() => {
      this.steps.fillCode = true;
      this.stepperNext();
      return this.cognitoService.signIn({ username: this.email, password: this.password });
    }).then(() => {
      this.resetSignUpForm();
    });
  }

  resendCode() {
    this.cognitoService.resendSignUpCode({ username: this.email }).then((response) => {
      this.alertService.success("The code was sent to the email address " + response.destination);
    });
  }

  passwordToggle() {
    this.hide = !this.hide;
  }

  private stepperNext() {
    // The setTimeout() is required due to state propagation via this.steps.signUp
    setTimeout(() => {
      this.stepper?.next();
    }, 0.5);
  }

  private resetSignUpForm() {
    this.email = "";
    this.password = "";
  }
}
