import { environment } from '../../../src/environments/environment';
import { PROJECT } from "./projects";

const processUrl = (url: string, currentProject: string) => {
  // if (environment.production && currentProject === PROJECT.APP) {
  //   return 'v1/' + url;
  // }
  return url;
};

export const AssetsUrl = (currentProject: string) => {
  return {
    githubIcon: processUrl('assets/icons/github.svg', currentProject),
    logoDark: processUrl('assets/logo-dark.svg', currentProject),
    logoLight: processUrl('assets/logo-light.svg', currentProject),
    moonIcon: processUrl('assets/icons/moon.svg', currentProject),
    sunIcon: processUrl('assets/icons/sun.svg', currentProject),
  };
};
