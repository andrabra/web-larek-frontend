import { IProduct } from '../model/ProductsDataTypes';

export interface ICard {
	id: string;
	index: number;
	description: string;
	image: string;
	inBasket: boolean;
	title: string;
	category: string;
	price: number | null;
}

export interface ICardsData {
	cards: IProduct[];
	getCard(id: string): IProduct | undefined;
}

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}
