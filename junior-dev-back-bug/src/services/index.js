import bkash from './bkash/bkash';

export const services = (app) => {
  app.configure(bkash);
};