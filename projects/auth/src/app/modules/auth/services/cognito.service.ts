import { Injectable } from '@angular/core';
import { Amplify, type ResourcesConfig } from "aws-amplify";
import { signIn, signUp, signOut, confirmSignUp, getCurrentUser, fetchAuthSession, type ConfirmSignUpInput, type SignInInput } from 'aws-amplify/auth';
import { environment } from '@app/../../../../src/environments/environment';
import { SignUpParameters } from "@modules/auth/types";
import { AppRoutes, AlertService } from "@globalShared";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  constructor(
    private alertService: AlertService,
    private router: Router,
  ) {
    const authConfig: ResourcesConfig['Auth'] = {
      Cognito: {
        userPoolId: environment.cognito.userPoolId,
        userPoolClientId: environment.cognito.userPoolWebClientId
      }
    };

    Amplify.configure({ Auth: authConfig });
  }

  public async handleSignUp({ email, password }: SignUpParameters) {
    try {
      console.log('email: ', email);
      console.log('password: ', password);

      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
          autoSignIn: true
        }
      });

      console.log('handleSignUp ___________');
      console.log('isSignUpComplete: ', isSignUpComplete);
      console.log('userId: ', userId);
      console.log('nextStep: ', nextStep);

    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  public async handleSignUpConfirmation({ username, confirmationCode }: ConfirmSignUpInput) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });

      console.log('handleSignUpConfirmation ___________');
      console.log('isSignUpComplete: ', isSignUpComplete);
      console.log('nextStep: ', nextStep);

    } catch (error) {
      console.log('error confirming sign up', error);
    }
  }

  public async signIn({ username, password }: SignInInput) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });

      console.log('handleSignIn ___________');
      console.log('isSignedIn: ', isSignedIn);
      console.log('nextStep: ', nextStep);

      if (isSignedIn) {
        this.router.navigate([AppRoutes.MAIN.DASHBOARD.relativePath]).then(() => {
          this.alertService.success('You have successfully logged in!')
        });
      }

    } catch (error) {
      this.alertService.error('Incorrect username or password');

      console.log('error signing in', error);
    }
  }

  public async signOut() {
    try {
      await signOut();

      this.router.navigate([AppRoutes.AUTH.LOGIN.relativePath]).then(() => {
        this.alertService.info('You have been successfully logged out.')
      });

      console.log('handleSignOut ___________');

    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  public async currentAuthenticatedUser() {
    try {
      const user = await getCurrentUser();

      console.log('user: ', user);

    } catch (err) {
      console.log(err);
    }
  }

  public async fetchAuthSession() {
    try {
      const session = fetchAuthSession();

      console.log('session: ', session);

    } catch (err) {
      console.log(err);
    }
  }

}
