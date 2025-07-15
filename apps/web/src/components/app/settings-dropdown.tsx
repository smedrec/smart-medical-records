import { Link } from "@tanstack/react-router";
import { CircleUser, Fingerprint, Hospital, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SettingsDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="size-8 rounded-full">
					<Settings />
					<span className="sr-only">Open settings</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				onCloseAutoFocus={(e) => e.preventDefault()}
			>
				<DropdownMenuLabel>Settings</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Link to="/app/settings/account" className="flex items-center">
							<CircleUser className="mr-3 h-4 w-4" />
							Account
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link to="/app/settings/security" className="flex items-center">
							<Fingerprint className="mr-3 h-4 w-4" />
							Security
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link to="/app/settings/organization" className="flex items-center">
							<Hospital className="mr-3 h-4 w-4" />
							Organization
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export { SettingsDropdown };
