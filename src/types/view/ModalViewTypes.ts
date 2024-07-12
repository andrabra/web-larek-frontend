import { IBasket } from "../model/BasketDataTypes";
import { IOrder } from "../model/OrderDataTypes";
import { ICard } from "./CardsViewTypes";




export type TModalSuccess = Pick<IBasket, 'getQuantity'>;

export type TPayment = 'card' | 'cash';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export enum ErrorStatus {
	EmptyEmail = 'Укажите почту',
	EmptyPhone = 'Укажите телефон',
	EmptyAddress = 'Укажите адрес',
	EmptyPayment = 'Выберите способ оплаты',
}
