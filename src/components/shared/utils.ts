export const generateId = () => `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const useCombinedRefs = <T,>(...refs: React.Ref<T>[]): React.RefCallback<T> => {
    return (node: T | null) => {
        refs.forEach(ref => {
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref && 'current' in ref) {
                (ref as React.MutableRefObject<T | null>).current = node;
            }
        });
    };
};