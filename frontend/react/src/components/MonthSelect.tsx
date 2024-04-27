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
import { format, setMonth } from "date-fns";
import { enUS } from "date-fns/locale";
import capitalize from "@/util/capitalize";

const months: Array<string> = [];
for (let i = 0; i < 12; i++) {
  months[i] = capitalize(
    format(setMonth(new Date(), i), "LLLL", { locale: enUS })
  );
}

export default function MonthSelect() {
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
        <Button role="combobox" aria-expanded={state.open} className={"w-fit"}>
          {state.choice == -1 ? "Month" : months[state.choice]}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-min">
        <Command>
          <CommandGroup>
            {months.map((option, i, options) => (
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
