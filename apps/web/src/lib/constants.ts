/**
 * Constant values for cache time-to-live (TTL) and stale times
 */
export const STALE_TIMES = {
	FREQUENT: 30000, // 30 seconds - for data that changes often
	STANDARD: 120000, // 2 minutes - default
	RARE: 600000, // 10 minutes - for rarely changing data
	NEVER: Number.POSITIVE_INFINITY, // Only refetch on explicit invalidation
};

export const USER_NAME = "user";
export const CHAT_SOURCE = "client_chat";
export const GROUP_CHAT_SOURCE = "client_group_chat";

export const AVATAR_IMAGE_MAX_SIZE = 512;

export enum FIELD_REQUIREMENT_TYPE {
	REQUIRED = "required",
	OPTIONAL = "optional",
}

export const FIELD_REQUIREMENTS = {
	name: FIELD_REQUIREMENT_TYPE.REQUIRED,
	username: FIELD_REQUIREMENT_TYPE.OPTIONAL,
	system: FIELD_REQUIREMENT_TYPE.REQUIRED,
	"settings.voice.model": FIELD_REQUIREMENT_TYPE.OPTIONAL,
	bio: FIELD_REQUIREMENT_TYPE.OPTIONAL,
	topics: FIELD_REQUIREMENT_TYPE.OPTIONAL,
	adjectives: FIELD_REQUIREMENT_TYPE.OPTIONAL,
	"style.all": FIELD_REQUIREMENT_TYPE.OPTIONAL,
	"style.chat": FIELD_REQUIREMENT_TYPE.OPTIONAL,
	"style.post": FIELD_REQUIREMENT_TYPE.OPTIONAL,
};
