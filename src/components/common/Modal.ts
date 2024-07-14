import { IEvents } from './../base/events';

import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Modal extends Component<HTMLElement> {
	closeButton: HTMLButtonElement;
	content: HTMLDivElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.content = ensureElement<HTMLDivElement>('.modal__content', container);

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.content.addEventListener('click', (event) => event.stopPropagation());
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	open() {
    this.toggleClass(this.container, 'modal_active', true);
		document.addEventListener('keydown', this.handleEscUp);
		this.events.emit('modal:open');
	}

	close() {
    this.toggleClass(this.container, 'modal_active', false);
		document.removeEventListener('keydown', this.handleEscUp);
		this.events.emit('modal:close');
	}

	handleEscUp(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			this.close();
		}
	}

	render(obj: HTMLElement): HTMLElement {
		this.content.replaceChildren(obj);

		return this.container;
	}
}
