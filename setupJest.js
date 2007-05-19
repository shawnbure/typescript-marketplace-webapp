require('idempotent-babel-polyfill');
require('raf');

const fetch = require('jest-fetch-mock');
const Enzyme = require('enzyme');

global.fetch = fetch;

jest.setTimeout(60000);

Enzyme.configure({});