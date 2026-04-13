import type { UserProfile } from './index.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
    }
  }
}

export {};
