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
  email: z.string().email(email).or(z.string().max(0, email)),
  phoneNumber: z
    .string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, phone)
    .or(z.string().max(0, phone)),
  startingDate: z.date(),
  endingDate: z.date(),
  price: z.string().regex(/^[1-9]\d*$/, price),
  note: z.string(),
  confirmed: z.boolean(),
});
