import { ICard } from "./CardsViewTypes";

export interface IBasketView {
	list: HTMLElement[] | null;
	total: number;
}

export type TModalBasket = Pick<ICard, 'title' | 'price'>;
