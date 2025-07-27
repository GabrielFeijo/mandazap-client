export function formatPhone(number: string): string {
	if (!number) return '';

	const digits = number.replace(/\D/g, '');

	if (!digits.startsWith('55') || digits.length < 12) return number;

	const country = digits.slice(0, 2);
	const area = digits.slice(2, 4);
	const firstPart = digits.slice(4, 8);
	const secondPart = digits.slice(8, 13);

	return `+${country} ${area} ${firstPart}-${secondPart}`;
}
