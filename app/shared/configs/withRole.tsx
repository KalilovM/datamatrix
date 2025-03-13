import type { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface WithRoleOptions {
	allowedRoles: Role[];
}

export function withRole<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	options: WithRoleOptions,
) {
	const ComponentWithRole = (props: P) => {
		const { data: session, status } = useSession();
		const router = useRouter();

		useEffect(() => {
			if (status === "loading") return;
			// Administrators always have access
			if (
				!session ||
				!options.allowedRoles.includes(session.user.role as Role)
			) {
				// Redirect to a forbidden page or show an error
				router.replace("/403");
			}
		}, [session, status, router]);

		if (status === "loading" || !session) {
			return <div>Loading...</div>;
		}

		// Although the effect should handle redirection, this is an extra safeguard.
		if (!options.allowedRoles.includes(session.user.role as Role)) {
			return <div>Нет доступа</div>;
		}

		return <WrappedComponent {...props} />;
	};

	return ComponentWithRole;
}
