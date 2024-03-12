/* tslint:disable */
// @ts-nocheck
const { writeFile, existsSync, mkdirSync } = require('fs');
const { argv } = require('yargs');

require('dotenv').config();
const environment = argv.environment;


function writeFileUsingFS(targetPath, environmentFileContent) {
  writeFile(targetPath, environmentFileContent, function (err) {
    if (err) {
      console.log(err);
    }
    if (environmentFileContent !== '') {
      console.log(`Wrote variables to ${targetPath}`);
    }
  });
}

const envDirectory = './src/environments';
if (!existsSync(envDirectory)) {
  mkdirSync(envDirectory);
}

writeFileUsingFS('./src/environments/environment.prod.ts', '');
writeFileUsingFS('./src/environments/environment.ts', '');


const isProduction = environment === 'prod';

const envPath = './src/environments/environment.ts';
const prodPath = './src/environments/environment.prod.ts';

const environmentFileContent = `
  export const environment = {
    production: ${isProduction},
    cognito: {
      userPoolId: '${process.env.COGNITO_USER_POOL_ID}',
      userPoolWebClientId: '${process.env.COGNITO_USER_POOL_CLIENT_ID}',
    },
    authAppUrl: '${isProduction ? 'https://auth.cloud-guard.app/' : 'http://localhost:4200/'}',
    clientAppUrl: '${isProduction ? 'https://cloud-guard.app/' : 'http://localhost:4300/'}',
    serverUrl: '${isProduction ? 'http://13.53.129.58:3001/' : 'http://13.53.129.58:3001/'}',
    cloudGuardBase64Iv: '${process.env.CLOUD_GUARD_BASE64_IV}',
  };
`;

const emptyEnvironmentFile = `
  export const environment = {
    production: false,
    cognito: {
      userPoolId: '',
      userPoolWebClientId: '',
    },
    authAppUrl: '',
    clientAppUrl: '',
    serverUrl: '',
    cloudGuardBase64Iv: '',
  };
`;

if (isProduction) {
  writeFileUsingFS(prodPath, environmentFileContent);
  writeFileUsingFS(envPath, emptyEnvironmentFile);
} else {
  writeFileUsingFS(prodPath, emptyEnvironmentFile);
  writeFileUsingFS(envPath, environmentFileContent);
}

/* tslint:enable */
