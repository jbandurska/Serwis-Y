import { io } from 'socket.io-client';
import { environment } from './env';

export const socket = io(environment.backendUrl);
