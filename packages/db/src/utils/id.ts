//import { createRandomStringGenerator } from "@better-auth/utils/random";
import { init } from '@paralleldrive/cuid2'

//export const generateId = (size?: number) => {
//return createRandomStringGenerator("a-z", "A-Z", "0-9")(size || 32);
//};

export const createId = (fingerprint: string) =>
	init({
		// the length of the id
		length: 32,
		// A custom fingerprint for the host environment. This is used to help
		// prevent collisions when generating ids in a distributed system.
		fingerprint: fingerprint,
	})
