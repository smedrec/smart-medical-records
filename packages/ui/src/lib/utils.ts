import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getLastWord(str: string): string {
	const words = str.split(' ')
	return words[words.length - 1]
}

export function removeLastWord(str: string): string[] {
	const words = str.split(' ')
	if (words.length > 1) {
		words.pop()
		return words
	} else {
		return []
	}
}
