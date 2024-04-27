import DropdownSelect from "@/components/DropdownSelect";
import SearchBar from "@/components/SearchBar";
import { format, setMonth } from "date-fns";
import { bg, enUS } from "date-fns/locale";
import capitalize from "@/util/capitalize";

const months: Array<string> = [];
for (let i = 0; i < 12; i++) {
  months[i] = capitalize(
    format(setMonth(new Date(), i), "LLLL", { locale: enUS })
  );
}

export default function SearchPage() {
  return (
    <main className="flex grow items-top justify-center p-4 md:p-6">
      <div className="flex flex-row grow-0 gap-4 h-fit items-center">
        <SearchBar />
        <DropdownSelect title="Month" options={months} />
        <Select></Select>
      </div>
    </main>
  );
}
