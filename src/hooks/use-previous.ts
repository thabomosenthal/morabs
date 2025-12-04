import React from "react";

export const usePrevious = (value: number) => {
	const ref = React.useRef<number>(null);
	React.useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};
