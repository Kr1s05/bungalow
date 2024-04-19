import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { ChangeEvent, useState } from "react";

type Category = "name" | "phone" | "email";

export default function Searchbar(props: { ClassName?: string }) {
  const [state, setState] = useState({
    search: "",
    keywords: [],
  });
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    const words = search.split(" ");
    const keywords = words.map(getCategory);
    setState((prevState) => ({ ...prevState, search }));
  };
  const getCategory = (
    word: string
  ): { word: string; categories: Array<Category> } => {
    const result: { word: string; categories: Array<Category> } = {
      word,
      categories: [],
    };
    const hasLetters = /[a-zA-Z]/.test(word);
    const hasNumbers = /[\d]/.test(word);
    const isEmail = word.includes("@");
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
