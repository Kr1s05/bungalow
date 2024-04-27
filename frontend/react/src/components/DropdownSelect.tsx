import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

export default function DropdownSelect(props: {
  buttonStyle?: string;
  title: string;
  options: Array<string>;
}) {
  const [state, setState] = useState<{
    open: boolean;
    choice: number;
  }>({
    open: false,
    choice: -1,
  });
  return (
    <Popover
      open={state.open}
      onOpenChange={(open) => {
        setState((prevState) => ({ ...prevState, open }));
      }}
    >
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={state.open}
          className={props.buttonStyle}
        >
          {state.choice == -1 ? props.title : props.options[state.choice]}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <Command>
          <CommandGroup>
            {props.options.map((option, i, options) => (
              <CommandItem
                key={i}
                value={options[i]}
                onSelect={(currentValue) => {
                  setState({
                    open: false,
                    choice: currentValue == options[state.choice] ? -1 : i,
                  });
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    state.choice === i ? "opacity-100" : "opacity-0"
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
