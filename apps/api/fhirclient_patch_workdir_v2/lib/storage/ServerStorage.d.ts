import { fhirclient } from '../types'

export default class ServerStorage {
	request: fhirclient.RequestWithSession
	/**
	 * @param request The HTTP request that is expected to have a
	 * "session" object property.
	 */
	constructor(request: fhirclient.RequestWithSession)
	/**
	 * Gets the value at `key`. Returns a promise that will be resolved
	 * with that value (or undefined for missing keys).
	 */
	get(key: string): Promise<any>
	/**
	 * Sets the `value` on `key` and returns a promise that will be resolved
	 * with the value that was set.
	 */
	set(key: string, value: any): Promise<any>
	/**
	 * Deletes the value at `key`. Returns a promise that will be resolved
	 * with true if the key was deleted or with false if it was not (eg. if
	 * did not exist).
	 */
	unset(key: string): Promise<boolean>
}
