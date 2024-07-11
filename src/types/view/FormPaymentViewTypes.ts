import { IOrder } from "../model/OrderDataTypes";

export type TModalFormOfPayment = Pick<IOrder, 'methodOfPayment' | 'address' | null>;
