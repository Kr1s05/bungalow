import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
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

export default function MonthSelect(props: {
  month: number;
  updateFunction: (month: number) => void;
}) {
  const [state, setState] = useState<{
    open: boolean;
  }>({
    open: false,
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
          className={
            "w-[120px] hover:bg-background hover:text-white border border-secondary"
          }
        >
          {props.month == -1 ? "Month" : months[props.month]}
          {state.open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-min">
        <Command>
          <CommandGroup>
            {months.map((option, i) => (
              <CommandItem
                key={i}
                value={String(i)}
                onSelect={(currentValue) => {
                  props.updateFunction(
                    Number(currentValue) == props.month
                      ? -1
                      : Number(currentValue)
                  );
                  setState({
                    open: false,
                  });
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    props.month === i ? "opacity-100" : "opacity-0"
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
