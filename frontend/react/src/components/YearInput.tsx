import { getFirstYear } from "@/api/reservationsApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
const first_year = await getFirstYear();
const current_year = new Date().getFullYear();
export default function YearInput(props: {
  year: number;
  updateFunction: (year: number) => void;
}) {
  return (
    <Select
      onValueChange={(year) => {
        props.updateFunction(Number(year));
      }}
      defaultValue="2024"
    >
      <SelectTrigger
        className="w-[85px] hover:border-none hover:bg-primary hover:text-primary-foreground"
        onFocus={(e) => {
          e.target.blur();
        }}
      >
        {props.year != -1 ? props.year : "Year"}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {[...Array(Math.min(first_year - current_year, 4) + 5).keys()].map(
            (i) => (
              <SelectItem value={String(first_year + i)} key={i}>
                {first_year + i}
              </SelectItem>
            )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
