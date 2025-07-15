import { match } from "@formatjs/intl-localematcher";
import { getHeader } from "@tanstack/react-start/server";
import Negotiator from "negotiator";
import { ensureWithPrefix } from "@/lib/utils";
import type { LocaleType } from "@/types";
import { i18n } from "./configs/i18n";

export function isPathnameMissingLocale(pathname: string) {
	return !i18n.locales.some((locale) => pathname.startsWith(`/${locale}`));
}

export function getLocaleFromPathname(pathname: string) {
	return i18n.locales.find((locale) => pathname.startsWith(`/${locale}`));
}

export function ensureLocalizedPathname(pathname: string, locale: string) {
	// Ensure both pathname and locale are provided
	if (!pathname || !locale)
		throw new Error("Pathname or Locale cannot be empty");

	// Add the locale prefix to the pathname if it is missing, otherwise return the original pathname
	return isPathnameMissingLocale(pathname)
		? `${ensureWithPrefix(locale, "/")}${ensureWithPrefix(pathname, "/")}`
		: pathname;
}

export function relocalizePathname(pathname: string, locale: string) {
	// Ensure both pathname and locale are provided
	if (!pathname || !locale)
		throw new Error("Pathname or Locale cannot be empty");

	const segments = pathname.split("/");
	segments[1] = locale;

	return segments.join("/");
}

export function getPreferredLocale(request: Request) {
	const settingsCookie = getHeader("settings");
	try {
		const parsedSettingsCookie = settingsCookie && JSON.parse(settingsCookie);

		// Return locale from settings cookie if available
		if (parsedSettingsCookie?.locale) {
			return parsedSettingsCookie.locale as LocaleType;
		}
	} catch (error) {
		console.error("Failed to parse settings cookie", error);
	}

	const supportedLocales = [...i18n.locales];
	const preferredLocales = new Negotiator({
		headers: Object.fromEntries(request.headers.entries()),
	}).languages(supportedLocales);

	// Match preferred locales with supported locales
	const locale = match(preferredLocales, supportedLocales, i18n.defaultLocale);

	return locale as LocaleType;
}
