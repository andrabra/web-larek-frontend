import { IOrder } from "../model/OrderDataTypes";

export type TModalFormOfContacts = Pick<IOrder, 'email' | 'phone'>;
