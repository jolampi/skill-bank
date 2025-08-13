export default async function LoginLayout(
  props: React.PropsWithChildren,
): Promise<React.ReactNode> {
  const { children } = props;

  return <main>{children}</main>;
}
