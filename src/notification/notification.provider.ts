import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import { resolve } from 'path';

const serviceAccount = require(
  resolve(process.cwd(), 'firebase-service-account.json'),
);

export const FirebaseAdminProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  },
};
