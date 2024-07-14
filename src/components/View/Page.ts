import { IPage } from './../../types/view/PageViewTypes';

import { IEvents } from './../base/events';

import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLButtonElement;
	protected _counter: HTMLSpanElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.gallery', container);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
		this._basket = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);
		this._counter = ensureElement<HTMLSpanElement>(
			'.header__basket-counter',
			this._basket
		);

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set locked(value: boolean) {
		if (value) {
      this.toggleClass(this._wrapper, 'page__wrapper_locked', true);
		} else {
      this.toggleClass(this._wrapper, 'page__wrapper_locked', false);
		}
	}

	set catalog(cards: HTMLElement[]) {
		if (cards) {
			this._catalog.replaceChildren(...cards);
		} else {
			this._catalog.innerHTML = '';
		}
	}

	set counter(value: number) {
		this.setText(this._counter, String(value) || '');
	}


}
