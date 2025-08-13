export interface ShowConditionallyProps {
  condition: boolean;
}

export function ShowConditionally(
  props: React.PropsWithChildren<ShowConditionallyProps>,
): React.ReactNode {
  const { children, condition } = props;

  if (!condition) {
    return null;
  }

  return children;
}
