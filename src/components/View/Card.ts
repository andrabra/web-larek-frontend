import { IEvents } from './../base/events';
import { Component } from './../base/Component';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { ICard, ICardAction } from '../../types/view/CardsViewTypes';

export class Card extends Component<ICard> {
	protected _id: string;
	protected _title: HTMLHeadingElement;
	protected _price: HTMLSpanElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLSpanElement;
	protected _description: HTMLParagraphElement;
	protected button: HTMLButtonElement;
	protected _index: HTMLSpanElement;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents,
		action?: ICardAction
	) {
		super(cloneTemplate(template), events);

		this._title = ensureElement<HTMLHeadingElement>(
			'.card__title',
			this.container
		);
		this._price = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.container
		);

		this._category = this.container.querySelector(
			'.card__category'
		) as HTMLSpanElement;
		this._image = this.container.querySelector(
			'.card__image'
		) as HTMLImageElement;
		this._description = this.container.querySelector(
			'.card__text'
		) as HTMLParagraphElement;
		this._index = this.container.querySelector(
			'.basket__item-index'
		) as HTMLSpanElement;
		this.button = this.container.querySelector(
			'.card__button'
		) as HTMLButtonElement;

		if (action?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', action.onClick);
			} else {
				this.container.addEventListener('click', action.onClick);
			}
		}
	}

	protected categoryClass(name: string): string {
		switch (name.toLowerCase()) {
			case 'софт-скил':
				return 'card__category_soft';
			case 'дополнительное':
				return 'card__category_additional';
			case 'кнопка':
				return 'card__category_button';
			case 'хард-скил':
				return 'card__category_hard';
			default:
				return 'card__category_other';
		}
	}

	set category(category: string) {
		this.setText(this._category, category);

		this.toggleClass(this._category, 'card__category_additional', category === 'дополнительное');
		this.toggleClass(this._category, 'card__category_soft', category === 'софт-скил');
		this.toggleClass(this._category, 'card__category_hard', category === 'хард-скил');
		this.toggleClass(this._category, 'card__category_other', category === 'другое');
	}

	set index(index: number) {
		this.setText(this._index, String(index));
	}

	set id(id: string) {
		this._id = id;
	}

	set title(title: string) {
		this.setText(this._title, title);
	}

	set price(price: string) {
		this.setText(this._price, price ? `${price} синапсов` : `Бесценно`);
	}

	set description(description: string) {
		this.setText(this._description, description);
	}

	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	set inBasket(state: boolean) {
		this.setText(
			this.button,
			state ? 'Удалить из корзины' : 'Добавить в корзину'
		);
	}
}
