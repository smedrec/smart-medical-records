import type {
	GetAgentResponse,
	GetToolResponse,
	GetWorkflowResponse,
} from "@mastra/client-js";
import type { icons, LucideIcon } from "lucide-react";
import type { ComponentType, SVGAttributes } from "react";
import type { i18n } from "@/lib/configs/i18n";

export type DirectionType = "ltr" | "rtl";

export type LocaleType = (typeof i18n)["locales"][number];

export interface IconProps extends SVGAttributes<SVGElement> {
	children?: never;
	color?: string;
}

export type IconType = ComponentType<IconProps> | LucideIcon;

export type DynamicIconNameType = keyof typeof icons;

export type Agent = GetAgentResponse;
export type Tool = GetToolResponse;
export type Workflow = GetWorkflowResponse;

export type AgentArrayItem = GetAgentResponse & { id: string };
