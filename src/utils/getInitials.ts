export function getInitials(name?: string, fallback: string = 'SN') {
	if (!name) return fallback;

	const parts = name.trim().split(/\s+/);
	if (parts.length === 0) return fallback;

	const first = parts[0][0];
	const last = parts.length > 1 ? parts[parts.length - 1][0] : '';

	return `${first}${last}`.toUpperCase();
}
