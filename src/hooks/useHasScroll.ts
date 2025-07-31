import { useEffect, useRef, useState } from 'react';

export const useHasScroll = () => {
	const [hasScroll, setHasScroll] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const checkScroll = () => {
			if (ref.current) {
				const { scrollHeight, clientHeight } = ref.current;
				setHasScroll(scrollHeight > clientHeight);
			}
		};

		checkScroll();

		const observer = new ResizeObserver(checkScroll);
		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => observer.disconnect();
	}, []);

	return { hasScroll, ref };
};
