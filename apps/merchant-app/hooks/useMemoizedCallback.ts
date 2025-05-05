import { useCallback, useRef } from "react";

export function useMemoizedCallback<T extends (...args: any[]) => any>(
	callback: T,
	dependencies: React.DependencyList,
) {
	const callbackRef = useRef(callback);

	// Update ref when callback changes
	callbackRef.current = callback;

	return useCallback((...args: Parameters<T>) => {
		return callbackRef.current(...args);
	}, dependencies);
}
