import { IProduct } from '../../types/model/ProductsDataTypes';
import { ICardsData } from '../../types/view/CardsViewTypes';
import { IEvents } from '../base/events';
import { Model } from './Model';

export class CardsData extends Model implements ICardsData {
	protected _cards: IProduct[];

	constructor(events: IEvents) {
		super(events);
		this._cards = [];
	}

	set cards(data: IProduct[]) {
		this._cards = data;
		this.events.emit('cards:changed', this._cards);
	}

	get cards() {
		return this._cards;
	}

	getCard(productId: string): IProduct | undefined {
		const product = this._cards.find((card) => card.id === productId);
		if (!product) throw Error(`Product with id ${productId} not found`);

		return product;
	}
}
