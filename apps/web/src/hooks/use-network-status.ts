interface NetworkInformation {
	effectiveType: "slow-2g" | "2g" | "3g" | "4g" | "unknown";
	saveData: boolean;
	[key: string]: unknown;
}

// Network status detection for smart polling
/**
 * A custom React hook that returns the network status information.
 * Utilizes the Network Information API if available.
 * @returns {{
 *  isOffline: boolean,
 *  effectiveType: string,
 *  saveData: boolean
 * }} The network status information including whether the user is offline, the effective connection type, and if data-saving mode is enabled.
 */
const useNetworkStatus = (): {
	isOffline: boolean;
	effectiveType: string;
	saveData: boolean;
} => {
	// Get navigator.connection if available (Network Information API)
	const connection =
		typeof navigator !== "undefined" && "connection" in navigator
			? (navigator as Navigator & { connection: NetworkInformation }).connection
			: null;

	// Return the effective connection type or a default value
	return {
		isOffline: typeof navigator !== "undefined" && !navigator.onLine,
		effectiveType: connection?.effectiveType || "unknown",
		saveData: connection?.saveData || false,
	};
};

export { useNetworkStatus };
