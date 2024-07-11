import { IProduct } from "../model/ProductsDataTypes";

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;

	inBasket: boolean;
  index: number;
}

export interface ICardsData {
	cards: IProduct[];
	getCard(id: string): IProduct | undefined;
}

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

