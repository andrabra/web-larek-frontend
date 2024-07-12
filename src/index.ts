import { Modal } from './components/common/Modal';
import { Success } from './components/View/Success';
import { FormContacts } from './components/View/FormOfContacts';
import { FormPayment } from './components/View/FormOfPayment';
import { OrderData } from './components/Model/OrderData';
import { Basket } from './components/View/Basket';

import { BasketData } from './components/Model/BasketData';
import { Card } from './components/View/Card';
import { Page } from './components/View/Page';
import { IProduct } from './types/model/ProductsDataTypes';
import { API_URL, CDN_URL } from './utils/constants';
import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { CardsData } from './components/Model/CardsData';
import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ICard } from './types/view/CardsViewTypes';
import { IOrder } from './types/model/OrderDataTypes';

// Находим все шаоблоны из разметки
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const templateCardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const templatePayment = ensureElement<HTMLTemplateElement>('#order');
const templateContacts = ensureElement<HTMLTemplateElement>('#contacts');
const templateSuccess = ensureElement<HTMLTemplateElement>('#success');

const containerPage = ensureElement<HTMLElement>('.page');
const containerModal = ensureElement<HTMLDivElement>('#modal-container');

// Создаем экземпляры классов 
const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Создаем экземпляры классов слоя данных
const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

// Создаем экземпляры классов слоя визуализации
const page = new Page(containerPage, events);
const modal = new Modal(containerModal, events);
const basket = new Basket(templateBasket, events);
const formOrder = new FormPayment(cloneTemplate(templatePayment), events);
const formContacts = new FormContacts(cloneTemplate(templateContacts), events);
const success = new Success(templateSuccess, events);

// Добавляем слушатель на все события
events.onAll((event) => {
	console.log('event: ', event);
});

// Блокировка страницы при открытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// Снятие блокировки страницы при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с бэкенда и записываем их в объект
api
	.getProducts()
	.then((data) => {
		cardsData.cards = data;
	})
	.catch(console.error);

// При изменении массива карточек вызываем функцию рендера карточек на странице
events.on('cards:changed', (cards: IProduct[]) => {
	page.catalog = cards.map((product) =>
		new Card(cardCatalogTemplate, events, {
			onClick: () => events.emit('preview:selected', product),
		}).render({
			...product,
		})
	);
});

// Отображение карточки в модальном окне
events.on('preview:selected', (product: ICard) => {
	modal.render(
		new Card(templateCardPreview, events, {
			onClick: () => events.emit('preview:submit', product),
		}).render({
			...product,
			inBasket: basketData.isInBasket(product.id),
		})
	);
	modal.open();
});

// Добавление/удаление карточки в/из корзину  и ререндер модалки карточки
events.on('preview:submit', (product: ICard) => {
	if (basketData.isInBasket(product.id)) {
		basketData.deleteProductFromBasket(product.id);
		modal.render(
			new Card(templateCardPreview, events, {
				onClick: () => events.emit('preview:submit', product),
			}).render({
				...product,
				inBasket: basketData.isInBasket(product.id),
			})
		);
	} else {
		basketData.addProductInBasket(product);
		modal.render(
			new Card(templateCardPreview, events, {
				onClick: () => events.emit('preview:submit', product),
			}).render({
				...product,
				inBasket: basketData.isInBasket(product.id),
			})
		);
	}
});

// Реакция счетчика товаров в корзине на главной странице
events.on('basket:changed', () => {
	page.counter = basketData.cardsInBasket.length;
});

//обработаем событие удаления товара из корзины
events.on('basket:delete', (data: IProduct) => {
	basketData.deleteProductFromBasket(data.id);
 	// ререндерим корзину
	modal.render(
		basket.render({
			total: basketData.getTotal(),
			list: basketData.cardsInBasket.map((product: IProduct, index: number) => {
				const card = new Card(templateCardBasket, events, {
					onClick: () => events.emit('basket:delete', product),
				});
				return card.render({
					title: product.title,
					id: product.id,
					price: product.price,
					index: ++index,
				});
			}),
		})
	);
});

//обработаем событие открытия корзины
events.on('basket:open', () => {
	modal.render(
		basket.render({
			total: basketData.getTotal(),
			list: basketData.cardsInBasket.map((product: IProduct, index: number) => {
				const card = new Card(templateCardBasket, events, {
					onClick: () => events.emit('basket:delete', product),
				});
				return card.render({
					title: product.title,
					id: product.id,
					price: product.price,
					index: ++index,
				});
			}),
		})
	);
	modal.open();
});

// Обработка события оформления заказа и рендер 1 формы(способ оплаты и адрес) в модальном окне
events.on('basket:submit', () => {
	orderData.clearOrder();
	modal.render(formOrder.render({ valid: false, ...orderData.paymentInfo }));
});

//взаимодействие пользователя с полями формы доставки
events.on('order:valid', () => {
	orderData.paymentInfo = {
		methodOfPayment: formOrder.payment,
		address: formOrder.address,
	};
});

events.on('contacts:valid', () => {
	orderData.contactInfo = {
		email: formContacts.email,
		phone: formContacts.phone,
	};
});

events.on('order:submit', () => {
	orderData.clearUserContacts();
	modal.render(formContacts.render({ valid: false, ...orderData.contactInfo }));
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { methodOfPayment, address, email, phone } = errors;
	formOrder.valid = !methodOfPayment && !address;
	formContacts.valid = !email && !phone;
	formOrder.errors = Object.values({ methodOfPayment, address })
		.filter((i) => !!i)
		.join(';  ');
	formContacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(';  ');
});

events.on('contacts:submit', () => {
	// Создание промежуточного объекта с данными для отправки на сервер
	const order: IOrder = {
		methodOfPayment: orderData.paymentInfo.methodOfPayment,
		address: orderData.paymentInfo.address,
		email: orderData.contactInfo.email,
		phone: orderData.contactInfo.phone,
		items: basketData.getProductIdsInBasket(),
		total: basketData.getTotal(),
	};

	// Преобразуем его в объект с нужным свойством payment
	const orderForServer = {
		...order,
		payment: order.methodOfPayment,
	};
	// Удаляем ненужное свойство
	delete orderForServer.methodOfPayment;

	// console.log(orderForServer);
	console.log(orderData.getOrderData());

	api
		.postOrder(orderForServer)
		.then((result) => {
			orderData.clearOrder();
			orderData.clearUserContacts();
			basketData.clearBasket();

			modal.render(success.render(result));
		})
		.catch((e) => console.error(e));
});

events.on('success:submit', () => {
	modal.close();
});
