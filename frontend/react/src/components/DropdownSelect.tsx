import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export default function DropdownSelect(props: {
  title: string;
  options: Array<{
    label: string;
    value: unknown;
  }>;
}) {
  const [state, setState] = useState<{
    open: boolean;
    choice: {
      id: number;
      value: unknown;
    };
  }>({
    open: false,
    choice: {
      id: -1,
      value: undefined,
    },
  });
  return (
    <Popover open={state.open}>
      <PopoverTrigger asChild>
        <Button>
          {state.choice.id == -1
            ? props.title
            : props.options[state.choice.id].label}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandGroup>
            {props.options.map((option) => (
              <CommandItem></CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
