import { ClientContext } from "@/api/AxiosClientProvider";
import { ReservationListType, searchReservations } from "@/api/reservationsApi";
import MonthSelect from "@/components/MonthSelect";
import ReservationList from "@/components/ReservationList";
import SearchBar, { Keyword } from "@/components/SearchBar";
import YearInput from "@/components/YearInput";
import { Separator } from "@/components/ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchPage() {
  const [state, setState] = useState<{
    keywords: Array<Keyword>;
    month: number;
    year: number;
    reservations: ReservationListType;
  }>({
    keywords: [],
    month: -1,
    year: 2024,
    reservations: [],
  });

  const queryClient = useQueryClient();
  const client = useContext(ClientContext);

  const query = useQuery({
    queryKey: ["search"],
    queryFn: ({ signal }) => {
      return searchReservations(
        {
          keywords: state.keywords,
          month: state.month != -1 ? state.month + 1 : -1,
          year: state.year,
        },
        signal,
        client
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
    <main className="flex flex-col grow align-top items-center p-4 md:p-6 gap-6">
      <div className="grid grid-cols-2 sm:flex flex-row w-full gap-4 h-fit justify-items-center items-center justify-center">
        <SearchBar updateFunction={updateSearch} ClassName="col-span-2" />
        <MonthSelect updateFunction={updateMonth} month={state.month} />
        <YearInput updateFunction={updateYear} year={state.year} />
      </div>
      <Separator className="hidden md:block" />
      {query.isLoading || !query.data ? (
        "Loading..."
      ) : (
        <ReservationList reservations={query.data} />
      )}
    </main>
  );
}
