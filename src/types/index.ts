export interface ICard {
	_id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	inBasket: boolean;
}

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
	contactInfo: TModalContacts;
	clearOrder(): void;
	clearUserContacts(): void;
	checkValidation(): boolean;
  getOrderData(): IOrder;
}

export interface ICardsData {
	cards: ICard[];
	preview: string | null;
	getCard(id: string): ICard | undefined;
}

export interface IBasket {
	purchases: ICard[];
	total: number;
	addPurchase(value: ICard): void;
	deletePurchase(id: string): void;
	clearBasket(): void;
	getQuantity(): number;
	getTotal(): number;
	getIdList(): string[];
}

export type TModalBasket = Pick<ICard, 'title' | 'price'>;
export type TModalFormOfPayment = Pick<IOrder, 'methodOfPayment' | 'address'>;
export type TModalContacts = Pick<IOrder, 'email' | 'phone'>;
export type TModalSuccess = Pick<IBasket, 'getQuantity'>;

export type TSuccessData = {id: string; total: number};

export type TPayment = 'online' | 'cash';
