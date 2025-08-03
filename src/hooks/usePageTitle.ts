import { useEffect } from 'react';

interface UsePageTitleProps {
	unreadCount: number;
	baseTitle?: string;
}

export const usePageTitle = ({
	unreadCount,
	baseTitle = 'MandaZap',
}: UsePageTitleProps) => {
	useEffect(() => {
		const newTitle =
			unreadCount > 0 ? `(${unreadCount}) ${baseTitle}` : baseTitle;

		document.title = newTitle;

		return () => {
			document.title = baseTitle;
		};
	}, [unreadCount, baseTitle]);

	const resetTitle = () => {
		document.title = baseTitle;
	};

	const setCustomTitle = (title: string) => {
		document.title = title;
	};

	return {
		resetTitle,
		setCustomTitle,
	};
};
