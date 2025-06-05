import { ChangeEventHandler, Dispatch, SetStateAction, useId, useState } from "react";

type InputType = "password" | "text";

export interface TextInput {
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type: InputType;
  value: string;
}

export type UseTextInputHook = [TextInput, Dispatch<SetStateAction<string>>];

export default function useInput(type: InputType): UseTextInputHook {
  const id = useId();
  const [value, setValue] = useState("");

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => setValue(e.target.value);

  return [{ id, onChange, type, value }, setValue];
}
