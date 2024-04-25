import DropdownSelect from "@/components/DropdownSelect";
import Searchbar from "@/components/Searchbar";

export default function SearchPage() {
  return (
    <main className="flex grow flex-row items-top justify-center p-4 md:p-6">
      <Searchbar />
      <DropdownSelect />
    </main>
  );
}
