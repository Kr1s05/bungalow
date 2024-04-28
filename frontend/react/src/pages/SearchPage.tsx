import { ReservationList, searchReservations } from "@/api/reservationsApi";
import MonthSelect from "@/components/MonthSelect";
import SearchBar, { Keyword } from "@/components/SearchBar";
import YearInput from "@/components/YearInput";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchPage() {
  const [state, setState] = useState<{
    keywords: Array<Keyword>;
    month: number;
    year: number;
    reservations: ReservationList;
  }>({
    keywords: [],
    month: -1,
    year: 2024,
    reservations: [],
  });

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["search"],
    queryFn: ({ signal }) => {
      return searchReservations(
        {
          keywords: state.keywords,
          month: state.month != -1 ? state.month + 1 : -1,
          year: state.year,
        },
        signal
      );
    },
  });

  const debouncedInvalidate = useDebouncedCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["search"] });
  }, 1000);

  const updateSearch = (keywords: Array<Keyword>) => {
    setState((prevState) => ({ ...prevState, keywords }));
    debouncedInvalidate();
  };
  const updateMonth = (month: number) => {
    setState((prevState) => ({ ...prevState, month }));
    debouncedInvalidate();
  };
  const updateYear = (year: number) => {
    setState((prevState) => ({ ...prevState, year }));
    debouncedInvalidate();
  };

  return (
    <main className="flex flex-col grow items-top justify-center p-4 md:p-6">
      <div className="flex flex-row grow-0 gap-4 h-fit items-center">
        <SearchBar updateFunction={updateSearch} />
        <MonthSelect updateFunction={updateMonth} month={state.month} />
        <YearInput updateFunction={updateYear} year={state.year} />
      </div>
      {JSON.stringify(query.data)}
    </main>
  );
}
