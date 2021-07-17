import { DependencyList, EffectCallback, useEffect } from "react";

export const useDebouncedEffect = (effect: EffectCallback, deps: DependencyList | undefined, delay: number) => {
    useEffect(() => {
        const handler = setTimeout(() => effect(), delay);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps || [], delay]);
}