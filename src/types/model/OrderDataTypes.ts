import { TModalFormOfContacts } from './../view/FormContactsViewTypes';
import { TModalFormOfPayment } from "../view/FormPaymentViewTypes";
import { TPayment } from "../view/ModalViewTypes";

export interface IOrder {
	methodOfPayment: TPayment;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

export interface IOrderData {
	paymentInfo: TModalFormOfPayment;
	contactInfo: TModalFormOfContacts;
	clearOrder(): void;
	clearUserContacts(): void;
	checkValidation(): boolean;
}
