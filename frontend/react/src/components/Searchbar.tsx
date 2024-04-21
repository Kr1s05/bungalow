import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { ChangeEvent, useState } from "react";

type Category = "name" | "phone" | "email";
type Keyword = { word: string; categories: Array<Category> };

export default function Searchbar(props: { ClassName?: string }) {
  const [state, setState] = useState<{
    search: string;
    keywords: Array<Keyword>;
  }>({
    search: "",
    keywords: [],
  });
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    const words = search.split(" ");
    const keywords = words
      .filter((word) => word != "" && word)
      .map(getCategory);
    console.log(JSON.stringify(keywords));
    setState((prevState) => ({ ...prevState, search, keywords }));
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
        "flex flex-row gap-2 bg-primary py-3 px-6 rounded-full" +
        (props.ClassName ? props.ClassName : "")
      }
    >
      <div className="bg-inherit rounded-full size-10 flex justify-center items-center">
        <Search color="black" size={28} strokeWidth={3} />
      </div>
      <Input
        type="text"
        placeholder="Search..."
        value={state.search}
        className="bg-background rounded-full grow px-5"
        onChange={handleSearchChange}
      />
    </div>
  );
}
