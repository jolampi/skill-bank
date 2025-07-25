export interface ControlledProps<T> {
  disabled?: boolean;
  value: T;
  onChange?: (t: T) => void;
}
