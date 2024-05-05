import {
  Reservation,
  getReservationsForMultipleMonths,
} from "@/api/reservationsApi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { reservationSchema } from "@/schemas/ReservationSchema";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  addDays,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
} from "date-fns";
import { CalendarIcon, CircleCheckBig, History } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function ReservationForm(props: {
  reservation?: Reservation;
  updateFunction: (r: z.infer<typeof reservationSchema>) => void;
}) {
  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      price: "0",
      note: "",
      confirmed: false,
    },
  });

  useEffect(() => {
    if (props.reservation) {
      form.setValue("firstName", props.reservation.FirstName);
      form.setValue("lastName", props.reservation.LastName);
      form.setValue("phoneNumber", props.reservation.PhoneNumber);
      form.setValue("email", props.reservation.Email);
      form.setValue("startingDate", props.reservation.StartingDate);
      form.setValue("endingDate", props.reservation.EndingDate);
      form.setValue("note", props.reservation.Note);
      form.setValue("price", String(props.reservation.Price));
      form.setValue("confirmed", props.reservation.Confirmed);
    }
  }, [props.reservation]);

  const [state, setState] = useState<{
    startingMonth: number;
    length: number;
    year: number;
  }>({
    startingMonth: form.getValues().startingDate
      ? form.getValues().startingDate.getMonth()
      : new Date().getMonth(),
    length: form.getValues().startingDate
      ? form.getValues().endingDate.getMonth() -
        form.getValues().startingDate.getMonth()
      : 1,
    year: form.getValues().startingDate
      ? form.getValues().startingDate.getFullYear()
      : new Date().getFullYear(),
  });

  const {
    data: reservations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => {
      return getReservationsForMultipleMonths(
        state.year,
        state.startingMonth + 1,
        state.length + 1
      );
    },
  });

  if (isError) {
    return (
      <p className="text-center text-xl">{"Error connecting to backend."}</p>
    );
  }

  if (isLoading || reservations == undefined) {
    return <p className="text-center text-xl">{"Loading..."}</p>;
  }

  const isReservedDate = (date: Date) => {
    if (!reservations) return false;
    for (const reservation of reservations) {
      if (reservation.ID == props.reservation?.ID) continue;
      if (isBefore(date, reservation.StartingDate)) continue;
      if (isAfter(date, reservation.EndingDate)) continue;
      return true;
    }
    return false;
  };

  const findReservationAfterDate = (date: Date) => {
    for (const r of reservations) {
      if (isBefore(date, r.StartingDate)) return r;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(props.updateFunction)}
        className="grid grid-cols-2 gap-x-4"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-3">First name</FormLabel>
              <FormControl>
                <Input {...field} className="sm:text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-3">Last name</FormLabel>
              <FormControl>
                <Input {...field} className="sm:text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-2 xl:col-span-1">
              <FormLabel className="ml-3">Email</FormLabel>
              <FormControl>
                <Input {...field} className="sm:text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="col-span-2 xl:col-span-1">
              <FormLabel className="ml-3">Phone number</FormLabel>
              <FormControl>
                <Input {...field} className="sm:text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startingDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="ml-3">Starting date: </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal sm:text-lg",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    ISOWeek
                    onMonthChange={(month) => {
                      setState({
                        startingMonth: month.getMonth(),
                        length: Math.abs(
                          form.getValues().endingDate
                            ? form.getValues().endingDate.getMonth() -
                                month.getMonth()
                            : new Date().getMonth() - month.getMonth()
                        ),
                        year: month.getFullYear(),
                      });
                    }}
                    showOutsideDays={false}
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) => {
                      if (isReservedDate(date)) return true;
                      const end = form.getValues().endingDate;
                      if (end) return !isBefore(date, addDays(end, 1));
                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endingDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="ml-3">Ending date: </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal sm:text-lg",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : form.getValues().startingDate ? (
                        <span>Pick a date</span>
                      ) : (
                        <span>Pick starting date first</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onMonthChange={(month) => {
                      setState((prevState) => ({
                        ...prevState,
                        length:
                          month.getMonth() -
                          form.getValues().startingDate.getMonth(),
                      }));
                    }}
                    ISOWeek
                    showOutsideDays={false}
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) => {
                      const start = form.getValues().startingDate;
                      if (!start) return true;
                      if (isBefore(date, start)) return true;
                      const reservation = findReservationAfterDate(start);
                      if (!reservation) return false;
                      return (
                        differenceInCalendarDays(date, start) >=
                        differenceInCalendarDays(
                          reservation.StartingDate,
                          start
                        )
                      );
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-3">Price: </FormLabel>
              <FormControl>
                <div className="grid grid-cols-7">
                  <Input
                    {...field}
                    className="col-span-5 rounded-r-none sm:text-lg"
                  />
                  <span className="border border-secondary rounded-sm rounded-l-none text-center pt-2 col-span-2 bg-secondary">
                    лв.
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmed"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="ml-3 mt-0 text-md">Confirmed: </FormLabel>
              <FormControl>
                <Checkbox
                  className="self-center"
                  checked={field.value}
                  disabled={field.disabled}
                  onBlur={field.onBlur}
                  onCheckedChange={field.onChange}
                  name={field.name}
                  asChild
                >
                  <div className="w-3/4 flex flex-row justify-center">
                    {field.value ? (
                      <CircleCheckBig color="green" size={45} />
                    ) : (
                      <History color="hsl(var(--primary))" size={45} />
                    )}
                  </div>
                </Checkbox>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Note: </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any notes?"
                  {...field}
                  className="resize-none lg:resize-y sm:text-lg lg:min-h-44 lg:max-h-[500px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-2 flex items-center justify-center">
          <Button type="submit" className="w-1/2 h-12 text-lg">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
