import { z } from "zod";
const [required, email, phone, price] = [
  "Required*",
  "Invalid email",
  "Invalid phone number",
  "Invalid price",
];
export const reservationSchema = z.object({
  firstName: z.string().min(1, required),
  lastName: z.string().min(1, required),
  email: z.string().min(1, required).email(email),
  phoneNumber: z.string().regex(/^(0|\+359)\d{9}$/, phone),
  startingDate: z.date(),
  endingDate: z.date(),
  price: z.string().regex(/^[1-9]\d*$/, price),
  note: z.string(),
  confirmed: z.boolean(),
});
