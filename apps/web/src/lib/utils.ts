import type { HTTPHeaderName } from "@tanstack/react-start/server";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type TransformedHeaders = Record<string, string> | undefined;

function processHeaders(
	headers: Partial<Record<HTTPHeaderName, string | undefined>>,
): TransformedHeaders {
	if (!headers) return undefined;

	// Filters undefined values
	const filtered: Record<string, string> = {};
	for (const [key, value] of Object.entries(headers)) {
		if (value !== undefined) {
			filtered[key] = value;
		}
	}
	return filtered;
}

export { processHeaders };

export function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with "-"
		.replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

export function ensureWithPrefix(value: string, prefix: string) {
	return value.startsWith(prefix) ? value : `${prefix}${value}`;
}

export function ensureWithSuffix(value: string, suffix: string) {
	return value.endsWith(suffix) ? value : `${value}${suffix}`;
}

export function ensureWithoutSuffix(value: string, suffix: string) {
	return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
}

export function ensureWithoutPrefix(value: string, prefix: string) {
	return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

export function ensureRedirectPathname(
	basePathname: string,
	redirectPathname: string,
) {
	const searchParams = new URLSearchParams({
		redirectTo: ensureWithoutSuffix(redirectPathname, "/"),
	});

	return ensureWithSuffix(basePathname, "?" + searchParams.toString());
}
