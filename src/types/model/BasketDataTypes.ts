import { ICard } from '../view/CardsViewTypes';
import { IProduct } from './ProductsDataTypes';
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
