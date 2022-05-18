import { Player } from '../models/Player';

declare global {
	namespace Express {
		interface Request {
			decodedUser?: Player;
		}
	}
}