import { IEvents } from './../base/events';

import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IBasketView } from '../../types/view/BasketViewTypes';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLUListElement | null;
	protected _total: HTMLSpanElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents
	) {
		super(cloneTemplate(template), events);

		this._list = ensureElement<HTMLUListElement>(
			'.basket__list',
			this.container
		);
		this._total = ensureElement<HTMLSpanElement>(
			'.basket__price',
			this.container
		);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this._button.addEventListener('click', () =>
			this.events.emit('basket:submit')
		);
	}

	set list(cards: HTMLElement[]) {
		this._list.replaceChildren(...cards);
	}

	set total(total: number) {
		this.setText(this._total, String(total) + ' синапсов');
    this.setDisabled(this._button, total <= 0);
	}


}
