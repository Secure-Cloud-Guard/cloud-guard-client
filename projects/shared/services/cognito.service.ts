import { Injectable } from '@angular/core';
import { NGXLogger } from "ngx-logger";
import { Amplify, type ResourcesConfig } from "aws-amplify";
import { signIn, signUp, signOut, confirmSignUp, resendSignUpCode, getCurrentUser, fetchAuthSession, type ConfirmSignUpInput, type SignInInput, type SignUpInput, type ResendSignUpCodeInput } from 'aws-amplify/auth';
import { environment } from '../../../src/environments/environment';
import { AlertService } from "./alert.service";
import { COGNITO_SERVICE_ERROR } from "../const";

@Injectable({
  providedIn: 'root',
})
export class CognitoService {

  constructor(
    private alertService: AlertService,
    private logger: NGXLogger,
  ) {
    const authConfig: ResourcesConfig['Auth'] = {
      Cognito: {
        userPoolId: environment.cognito.userPoolId,
        userPoolClientId: environment.cognito.userPoolWebClientId
      }
    };

    Amplify.configure({ Auth: authConfig });
  }

  public async signUp({ username, password }: SignUpInput) {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: { email: username },
          autoSignIn: true
        }
      });

      this.logger.log('isSignUpComplete: ', isSignUpComplete);
      this.logger.log('nextStep: ', nextStep);

      return { isSignUpComplete, userId, nextStep } ;

    } catch (error) {
      this.alertService.error(error as string);
      this.logger.error('error signing up:', error);

      return Promise.reject(COGNITO_SERVICE_ERROR);
    }
  }

  public async resendSignUpCode({ username }: ResendSignUpCodeInput) {
    try {
      const { destination, attributeName} = await resendSignUpCode({ username: username })
      return { destination, attributeName };

    } catch (error) {
      this.alertService.error(error as string);
      this.logger.error('error resendSignUpCode', error);

      return Promise.reject(COGNITO_SERVICE_ERROR);
    }
  }

  public async signUpConfirmation({ username, confirmationCode }: ConfirmSignUpInput) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });

      this.logger.log('isSignUpComplete: ', isSignUpComplete);
      this.logger.log('nextStep: ', nextStep);

    } catch (error) {
      this.alertService.error(error as string);
      this.logger.error('error confirming sign up', error);

      return Promise.reject(COGNITO_SERVICE_ERROR);
    }
  }

  public async signIn({ username, password }: SignInInput) {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });

      this.logger.log('isSignedIn: ', isSignedIn);
      this.logger.log('nextStep: ', nextStep);

      if (isSignedIn) {
        this.alertService.success('You have successfully logged in!')
        await this.redirectToApp();
      }
      return isSignedIn;

    } catch (error) {
      this.alertService.error('Incorrect username or password');
      this.logger.error('error signing in', error);
      return Promise.reject(COGNITO_SERVICE_ERROR);
    }
  }

  private async redirectToApp() {
    // @ts-ignore
    const win = document.getElementById('ifr')?.contentWindow;
    win.postMessage(JSON.parse(JSON.stringify(localStorage)), environment.clientAppUrl);

    setTimeout(() => {
      window.location.href = environment.clientAppUrl;
    }, 2000);
  }

  public async signOut() {
    try {
      await signOut({ global: true });
      this.alertService.info('You have been successfully logged out.')
      this.logger.log('The user sign out');

      if (!window.location.href.startsWith(environment.authAppUrl)) {
        window.location.href = environment.authAppUrl;
      }
    } catch (error) {
      this.logger.error('error signing out: ', error);
    }
  }

  public async currentAuthenticatedUser() {
    try {
      const user = await getCurrentUser();
      this.logger.log('user: ', user);

      return user;

    } catch (err) {
      this.logger.error(err);
      return Promise.reject(COGNITO_SERVICE_ERROR);
    }
  }

  public async currentUserId() {
    try {
      const { userId } = await this.currentAuthenticatedUser();
      return userId;

    } catch (err) {
      this.logger.error(err);
      return Promise.reject(COGNITO_SERVICE_ERROR);
    }
  }

  public async fetchAuthSession() {
    try {
      const session = await fetchAuthSession();
      this.logger.log('session: ', session);

      return session;

    } catch (err) {
      this.logger.error(err);
      return Promise.reject(COGNITO_SERVICE_ERROR);
    }
  }

  public async getAccessToken() {
    try {
      const session = await this.fetchAuthSession();
      return session?.tokens?.accessToken.toString();

    } catch (err) {
      this.logger.error(err);
      return Promise.reject(COGNITO_SERVICE_ERROR);
    }
  }
}
