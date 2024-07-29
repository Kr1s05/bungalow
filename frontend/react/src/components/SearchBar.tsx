import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { ChangeEvent, useState } from "react";

export type Category = "name" | "phone" | "email";
export type Keyword = { word: string; categories: Array<Category> };

export default function SearchBar(props: {
  ClassName?: string;
  updateFunction: (keywords: Array<Keyword>) => void;
}) {
  const [search, setSearch] = useState<string>("");
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    const words = search.split(" ");
    const keywords = words
      .filter((word) => word != "" && word)
      .map(getCategory);
    setSearch(search);
    props.updateFunction(keywords);
  };
  const getCategory = (word: string): Keyword => {
    const result: Keyword = {
      word,
      categories: ["email", "name", "phone"],
    };
    const hasLetters = /[a-zA-Z]/.test(word);
    const hasNumbers = /[\d]/.test(word);
    const isEmail = word.includes("@");
    if (isEmail) {
      result.categories = ["email"];
      return result;
    }
    if (hasLetters) {
      result.categories = ["email", "name"];
    } else {
      result.categories = ["phone"];
    }
    if (hasNumbers) {
      result.categories = result.categories.filter((c) => c != "name");
    } else {
      result.categories = result.categories.filter((c) => c != "phone");
    }
    return result;
  };
  return (
    <div
      className={
        "flex flex-row gap-2 bg-primary py-3 px-6 rounded-full h-fit " +
        (props.ClassName ? props.ClassName : "")
      }
    >
      <div className="bg-inherit rounded-full size-10 flex justify-center items-center">
        <Search color="black" size={28} strokeWidth={3} />
      </div>
      <Input
        type="text"
        placeholder="Search..."
        value={search}
        className="bg-background rounded-full grow px-5"
        onChange={handleSearchChange}
      />
    </div>
  );
}
