import { ClientContext } from "@/api/AxiosClientProvider";
import { getFirstYear } from "@/api/reservationsApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
const current_year = new Date().getFullYear();
export default function YearInput(props: {
  year: number;
  updateFunction: (year: number) => void;
}) {
  const client = useContext(ClientContext);
  const { isLoading, data: first_year } = useQuery({
    queryKey: ["first year"],
    queryFn: () => getFirstYear(client),
    staleTime: Infinity,
  });
  if (isLoading || !first_year) {
    return <span>Loading...</span>;
  }
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
