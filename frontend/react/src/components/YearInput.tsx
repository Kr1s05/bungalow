import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function YearInput() {
  return (
    <Select>
      <SelectTrigger className="w-[74px]">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup></SelectGroup>
      </SelectContent>
    </Select>
  );
}
