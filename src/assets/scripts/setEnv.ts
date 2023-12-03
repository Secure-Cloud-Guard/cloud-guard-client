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

const targetPath = isProduction
  ? './src/environments/environment.prod.ts'
  : './src/environments/environment.ts';

const environmentFileContent = `
  export const environment = {
    production: ${isProduction},
    cognito: {
      userPoolId: '${process.env.COGNITO_USER_POOL_ID}',
      userPoolWebClientId: '${process.env.COGNITO_USER_POOL_CLIENT_ID}',
    },
  };
`;

writeFileUsingFS(targetPath, environmentFileContent);

/* tslint:enable */
