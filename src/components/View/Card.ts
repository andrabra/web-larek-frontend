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


	set category(category: string) {
    const categoryClasses: { [key: string]: string } = {
        'дополнительное': 'card__category_additional',
        'софт-скил': 'card__category_soft',
        'хард-скил': 'card__category_hard',
        'другое': 'card__category_other',
    };

    // Удаляем все классы перед добавлеием нужного
    Object.values(categoryClasses).forEach(className => {
        this.toggleClass(this._category, className, false);
    });

    // Добавляем нужный класс
    const className = categoryClasses[category.toLowerCase()] || 'card__category_other';
    this.toggleClass(this._category, className, true);

    this.setText(this._category, category);
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
