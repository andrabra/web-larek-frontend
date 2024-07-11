import { TModalFormOfPayment } from './../../types/view/FormPaymentViewTypes';


import { TPayment } from '../../types/view/ModalViewTypes';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from './Form';

export interface IFormOfPayment {
	payment: TPayment | null;
	address: string;
}

export class FormPayment
	extends Form<TModalFormOfPayment>
	implements IFormOfPayment
{
	protected containerButtons: HTMLDivElement;
	protected buttonCard: HTMLButtonElement;
	protected buttonCash: HTMLButtonElement;
	protected inputAddress: HTMLInputElement;
	protected orderButtonElement: HTMLButtonElement;
	protected _payment: TPayment | null;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.containerButtons = ensureElement<HTMLDivElement>(
			'.order__buttons',
			container
		);
		this.inputAddress = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;
		this.buttonCard = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this.buttonCash = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this.orderButtonElement = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);

		this.orderButtonElement.addEventListener('click', (evt) => {
			evt.preventDefault();
			events.emit('order:submit', {
				address: this.inputAddress.value,
				payment: this.payment,
			});
		});

		this.buttonCard.addEventListener(
			'click',
			this.handlePaymentButtonClick.bind(this)
		);
		this.buttonCash.addEventListener(
			'click',
			this.handlePaymentButtonClick.bind(this)
		);
	}

	private handlePaymentButtonClick(event: MouseEvent) {
		const button = event.target as HTMLButtonElement;
		this.payment = button.name as TPayment;
		this.events.emit(`${this.container.name}:valid`);
	}

	set address(value: string) {
		this.inputAddress.value = value;
	}

	get address(): string {
		return this.inputAddress.value;
	}

	get payment() {
		return this._payment;
	}

	protected set payment(value: TPayment | null) {
		this._payment = value;

		if (this.payment === 'card') {
			this.buttonCard.classList.add('button_alt-active');
			this.buttonCash.classList.remove('button_alt-active');
		} else if (this.payment === 'cash') {
			this.buttonCard.classList.remove('button_alt-active');
			this.buttonCash.classList.add('button_alt-active');
		} else {
			this.buttonCash.classList.remove('button_alt-active');
			this.buttonCard.classList.remove('button_alt-active');
		}
	}
}
