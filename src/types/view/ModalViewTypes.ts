import { IBasket } from "../model/BasketDataTypes";
import { IOrder } from "../model/OrderDataTypes";
import { ICard } from "./CardsViewTypes";




export type TModalSuccess = Pick<IBasket, 'getQuantity'>;

export type TPayment = 'card' | 'cash';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export enum ErrorStatus {
	EmptyEmail = 'Необходимо указать email',
	EmptyPhone = 'Необходимо указать телефон',
	EmptyAddress = 'Необходимо указать адрес',
	EmptyPayment = 'Выберите способ оплаты',
}
