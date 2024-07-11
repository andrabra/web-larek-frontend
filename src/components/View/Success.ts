import { ISuccessView } from './../../types/view/ModalSuccessViewTypes';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { cloneTemplate, ensureElement } from '../../utils/utils';


export class Success extends Component<ISuccessView> {
	protected _total: HTMLParagraphElement;
	protected buttonOrderSuccess: HTMLButtonElement;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents
	) {
		super(cloneTemplate(template), events);

		this._total = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);
		this.buttonOrderSuccess = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this.buttonOrderSuccess.addEventListener('click', () =>
			this.events.emit('success:submit')
		);
	}

	set total(value: string) {
		this.setText(this._total, `Списано ${value || '0'} синапсов`);
	}
}
