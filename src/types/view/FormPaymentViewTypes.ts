import { IOrder } from "../model/OrderDataTypes";
import { TPayment } from "./ModalViewTypes";

export interface IFormOfPayment {
	payment: TPayment | null;
	address: string;
}

export type TModalFormOfPayment = Pick<IOrder, 'methodOfPayment' | 'address' | null>;
