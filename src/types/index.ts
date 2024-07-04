export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price?: number;
	isInBasket: boolean;
	index: number;
}

export interface IProduct {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price?: number;
}

export interface ICardsData {
	cards: IProduct[];
	getCard(cardId: string): IProduct | undefined;
}

export interface IOrder {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderData {
	paymentInfo: TFormOfPayment;
	contactInfo: TFormOfContact;
	clearOrder(): void;
	clearUserContacts(): void;
	checkValidation(): boolean;
  getOrderData(): IOrder;
}

export interface IBasketData {
	cardsInBasket: IProduct[];
	total: number;
	addProductInBasket(product: IProduct): void;
	deleteProductFromBasket(id: string): void;
	clearBasket(): void;
	getTotal(): number;
	isInBasket(productId: string): boolean;
	getProductsInBasket(): IProduct[];
	getProductIdsInBasket(): string[];
}

export interface ISuccessData {
	orderSuccess: TSuccessData;
}

export type TForm = { valid: boolean };

// export type TFormOfPayment = Pick<IOrder, 'payment' | 'address' | null>;
export type TFormOfPayment = Pick<IOrder, 'payment' | 'address'>;

export type TFormOfContact = Pick<IOrder, 'email' | 'phone'>;

export type TSuccessData = { id: string; total: string };

export type TPayment = 'card' | 'cash' | null;

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export enum ErrorStatus {
	EmptyEmail = 'Укажите email!',
	EmptyPhone = 'Укажите телефон!',
	EmptyAddress = 'Укажите адрес!',
	EmptyPayment = 'Выберите способ оплаты!',
}
