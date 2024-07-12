import { IEvents } from '../base/events';
import { IOrder, IOrderData } from '../../types/model/OrderDataTypes';
import { ErrorStatus, FormErrors } from '../../types/view/ModalViewTypes';
import { TModalFormOfPayment } from '../../types/view/FormPaymentViewTypes';
import { TModalFormOfContacts } from '../../types/view/FormContactsViewTypes';

export class OrderData implements IOrderData {
	protected _paymentInfo: TModalFormOfPayment;
	protected _contactInfo: TModalFormOfContacts;
	protected order: IOrder;
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {
		this.clearOrder();
		this.clearUserContacts();
	}

	clearOrder() {
		this._paymentInfo = {
			address: '',
			methodOfPayment: null,
		};
	}

	clearUserContacts() {
		this._contactInfo = {
			email: '',
			phone: '',
		};
	}

	set paymentInfo(info: TModalFormOfPayment) {
		this._paymentInfo.methodOfPayment = info.methodOfPayment;
		this._paymentInfo.address = info.address;
		if (this.checkValidation()) {
			this.events.emit('order:ready', this.paymentInfo);
		}
	}

	get paymentInfo() {
		return this._paymentInfo;
	}

	set contactInfo(info: TModalFormOfContacts) {
		this._contactInfo.email = info.email;
		this._contactInfo.phone = info.phone;
		if (this.checkValidation()) {
			this.events.emit('сontacts:ready', this.contactInfo);
		}
	}

	get contactInfo() {
		return this._contactInfo;
	}

	checkValidation() {
		const errors: typeof this.formErrors = {};
		if (!this._paymentInfo.methodOfPayment) {
			errors.methodOfPayment = ErrorStatus.EmptyPayment;
		}
		if (!this._paymentInfo.address) {
			errors.address = ErrorStatus.EmptyAddress;
		}
		if (!this._contactInfo.email) {
			errors.email = ErrorStatus.EmptyEmail;
		}
		if (!this._contactInfo.phone) {
			errors.phone = ErrorStatus.EmptyPhone;
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getOrderData() {
		return this._contactInfo;
	}
}
