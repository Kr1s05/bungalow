import MonthSelect from "@/components/MonthSelect";
import SearchBar from "@/components/SearchBar";
import YearInput from "@/components/YearInput";

export default function SearchPage() {
  return (
    <main className="flex grow items-top justify-center p-4 md:p-6">
      <div className="flex flex-row grow-0 gap-4 h-fit items-center">
        <SearchBar />
        <MonthSelect />
        <YearInput />
      </div>
    </main>
  );
}
