import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../firebase-service-account.json');

export const FirebaseAdminProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  },
};
