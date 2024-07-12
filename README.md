# Проектная работа "Веб-ларек"

[Ссылка на репозиторий](https://github.com/andrabra/web-larek-frontend)

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с TS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/common - папка со служебным кодом
- src/components/model - папка с кодом моделей данных
- src/components/view - папка с кодом моделей отображения

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types — папка с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных используемые в приложении


Карточка товара используемая в слое отображения

```
export interface ICard {
	id: string;
	index: number;
	description: string;
	image: string;
	inBasket: boolean;
	title: string;
	category: string;
	price: number | null;
}
```

Интерфейс для отображения всего каталога карточек товаров

```
export interface ICardsData {
	cards: IProduct[];
	getCard(id: string): IProduct | undefined;
}
```

Интерфейс для обработчика событий при нажатии на карточку

```
export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}
```

Интерфейс для объекта карточки, который приходит с бэкенда
```
export interface IProduct{
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price?: number;
}
```

Интерфейс для объекта заказа

```
export interface IOrder {
	methodOfPayment: TPayment;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}
```

Интерфейс для модели данных заказа

```
export interface IOrderData {
	paymentInfo: TModalFormOfPayment;
	contactInfo: TModalFormOfContacts;
	clearOrder(): void;
	clearUserContacts(): void;
	checkValidation(): boolean;
  getOrderData(): any;
}

```

Интерфейс для объекта корзины

```
export interface IBasket {
	purchases: ICard[];
	total: number;
	addPurchase(value: ICard): void;
	deletePurchase(id: string): void;
	clearBasket(): void;
	getQuantity(): number;
	getTotal(): number;
	getIdList(): string[];
}
```

Интерфейс для модели данных корзины

```
export interface IBasketData {
	cardsInBasket: IProduct[];

	addProductInBasket(product: IProduct): void;
	deleteProductFromBasket(id: string): void;
	clearBasket(): void;
	getTotal(): number;
	isInBasket(productId: string): boolean;
	getProductsInBasket(): IProduct[];
	getProductIdsInBasket(): string[];
}
```

Данные, используемые при открытии корзины

```
export type TModalBasket = Pick<ICard, 'title' | 'price'>;
```

Данные, используемые при открытии модального окна со способом оплаты и адресом

```
export type TModalFormOfPayment = Pick<
	ICustomer,
	'methodOfPayment' | 'address'
>;
```

Данные используемые при открытии модального окна с контактной информацией

```
export type TModalContacts = Pick<ICustomer, 'email' | 'phone'>;
```

Данные, используемые при открытии модального окна с корзиной

```
export type TModalSuccess = Pick<IBasket, 'getQuantity'>;
```

Тип оплаты

```
export type TPayment = 'card' | 'cash';
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Конструктор:

- `constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально)
  Методы:
- `handleResponse(response: Response): Promise<object>` - обрабатывает ответа с сервера. Если ответ с сервера пришел, то возвращается его в формате json, в противном случае формирует ошибку
- `get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\

Поля:

- `_events: Map<EventName, Set<Subscriber>>` - хранит события
  Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие
- `emit<T extends object>(event: string, data?: T): void` - инициализация события
- `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие
- `onAll(callback: (event: EmitterEvent) => void)` - подписка на все события
- `offAll()` - для сброса событий

### Слой данных - Model

#### Класс Model
Абстрактный базовый класс, шаблон для классов данных.
Конструктор класса принимает инстант брокера событий и объект содержащий данные модели. Используется `Partial<T>`, чтобы разрешить частичное заполнение данных.
- `constructor(protected events: IEvents)`

Так же класс предоставляет набор методов для взаимодействия с этими данными.
`emitChanges`
`emitChanges(event: string, payload?: object)`

- `event:` Имя события, которое будет сгенерировано.
- `payload:` Дополнительные данные, которые будут переданы вместе с событием (необязательно).
Этот метод используется для оповещения всех подписчиков о том, что модель изменилась.

#### Класс CardsData

Расширяет класс Model. Класс отвечает за хранение и логику работы с каталогом товаров(карточек).\
Конструктор класса принимает инстант брокера событий.

- `constructor(events: IEvents)`

В полях класса хранятся следующие данные:

- `protected _cards: ICard[]` - массив объектов карточек.

Так же класс предоставляет набор методов(сеттеров и геттеров) для взаимодействия с этими данными.

- `getCard(productId: string): IProduct | undefined ` - параметром принимает id карточки и возвращает карточку, соответствующую переданному id.
- `set cards(data: IProduct[]): void` - записывает массив товаров.
- `get cards(): ICard[]` - возвращает массив товаров.

#### Класс BasketData

Класс расширяет базовый класс `Model` и отвечает за логику и хранение данных товаров, добавленных в корзину.\
Конструктор класса принимает инстант брокера событий.

`constructor(protected events: IEvents)`

В полях класса хранятся следующие данные:

- `protected _cardsInBasket: IProduct[]` - коллекция товаров в корзине
- `protected _total: number` - суммарная стоимость товаров в корзине.

Также в классе содержатся методы(сеттеры и геттеры) для работы с данными объекта, который формирует класс

- `isInBasket(productId: string)` - метод для поиска значения id товара
- `getProductsInBasket(): IProduct[]` - метод возвращает товары добавленные в корзину.
- `addProductInBasket(product: IProduct)` - метод позволяющий добавлять товары в корзину.
- `deleteProductFromBasket(id: string)` - метод, позволяющий удалять товар из корзины.
- `clearBasket()` - метод для очиски корзины.
- `getTotal()` - метод, возвращающий общую сумму товаров в корзине.
- `getProductIdsInBasket(): string[]` - метод возвращает массив id товаров, которые лежат в корзине.

- `get cardsInBasket()` - возвращает массив объектов товаров в корзине

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.\
Конструктор класса принимает инстант брокера событий.
- `constructor(events: IEvents)`

В полях класса хранятся следующие данные:
- `_paymentInfo: TModalFormOfPayment` - платежная информация
- `_contactInfo: TModalContacts` - контактная информация

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- `clearOrder(): void` - очищает данные о способе оплаты и адресе
- `clearUserContacts(): void` - очищает контактные данные покупателя
- `checkValidation(): boolean` - проверяет данные заказа

Также в классе содержатся методы для работы с данными объекта, который формирует класс:
 - `set paymentInfo(info: TModalFormOfPayment): void` - запись платежной информации
 - `get paymentInfo(): TModalFormOfPayment` - возвращает данные о способе оплаты и адресе
 - `set contactInfo(info: TModalContacts): void` - запись контактной информации
 - `get contactInfo(): TModalContacts` - возвращает контактную информацию.

### Слой представления - View

#### Класс Component
Абстрактный базовый класс. Получает в конструктор `protected readonly container: HTMLElement` и `protected readonly events?: IEvents`. Предоставляет собой инструментарий для работы с DOM-элементами. 

В классе содержатся следующие методы
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - метод, позволяющий переключать класс.
- `protected setText(element: HTMLElement, value: unknown)` - метод, который устанавливает текст в DOM элемент.
- `setDisabled(element: HTMLElement, state: boolean)` - смена статуса блокировки элемента.
- `protected setHidden(element: HTMLElement)` - скрывает элемент.
- `protected setVisible(element: HTMLElement)` - показывает элемент.
- `protected setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение с альтернативным текстом.
- `render(data?: Partial<T>): HTMLElement` - возвращает корневой дом элемент, добавляя к нему свойства переданные в `data`.

#### Класс Modal
Расширяет родительский класс `Component`. Отвечает за создание компонента модального окна с разным содержимым.

В полях класса содержатся следующие данные
- `closeButton: HTMLButtonElement` - кнопка закрытия модалки, существует у всех модальных окон.
- `content: HTMLDivElement` - содержимое модального окна.

В параметры конструктора класс принимает следующие значения
- `protected container: HTMLElement` - контейнер для компонента, который передается в родительский класс через `super`.
- `protected events: IEvents` - экземпляр брокера событий.

Класс предоставляет набор методов для работы с модальным окном
- `open()` - открывает модальное окно, добавляя к контейнеру соответствующий класс из разметки и генерируя событие открытия модального окна.
- `close()` - закрывает модальное окно, удаляя к контейнеру соответствующий класс из разметки и генерируя событие закрытия модального окна.
- `handleEscUp(event: KeyboardEvent)` - метод для закрытия модального окна по кнопке Escape.
- `render(obj: HTMLElement): HTMLElement` - метод для рендера содержимого модального окна в дочерних классах. Должен заменять содержимое родительского класса.

#### Класс Card
Расширяет родительский класс `Component`. Класс отвечает за формирование компонента карточки для отображения на странице.

Поля:
- `protected _id: string;` - id товара с сервера.
- `protected _title: HTMLHeadingElement;` - Название карточки товара.
- `protected _price: HTMLSpanElement;` - цена товара.
- `protected _image: HTMLImageElement;` - изображение товара.
- `protected _category: HTMLSpanElement;` - категория товара.
- `protected _description: HTMLParagraphElement;` - описание товара.
- `protected button: HTMLButtonElement;` - кнопка для добавления в корзину.
- `protected _index: HTMLSpanElement;` - индекс карточки, для нумерации товаров в корзине.


Параметры в конструкторе:

- `protected template: HTMLTemplateElement` - шаблон карточки из разметки.
- `protected events: IEvents` - объект брокера событий.
- `action?: ICardAction` - объект для назначения пользовательских событий.

Также в классе содержатся сеттеры для работы с данными объекта, который формирует класс:

- `set category(category: string)` - позволяет установить категорию и класс для стилизации.
- `set index(index: number)` - позволяет установить индекс карточки, для нумерации товаров в корзине.
- `set id(id: string)` - позволяет установить id для карточки.
- `set title(title: string)` - устанавливает название карточки.
- `set price(price: string)` - устанавливает цену товара.
- `set description(description: string)` - устанавливает описание товара.
- `set image(src: string)` - устанавливает изображение в карточку товара.
- `set inBasket(state: boolean)` - меняет текст кнопки, в зависимости от нахождения товара в корзине.

#### Класс Basket
Расширяет класс Component. Служит для отображения компонента корзины и товаров в ней.

Поля:

- `protected _list: HTMLUListElement | null` - cписок товаров в корзине.
- `protected _total: HTMLSpanElement` - общее сумма.
- `protected _button: HTMLButtonElement` - кнопка покупки.

Параметры в конструкторе:

- `protected template: HTMLTemplateElement` - шаблон для отображения компонента корзины.
- `protected events: IEvents` - экземпляр брокера событий.

Также в классе содержатся методы для работы с данными объекта, который формирует класс:

- `set list(cards: HTMLElement[])` - позволяет заполнить список товаров к корзине.
- `set total(total: number)` - устанавливает общую сумму для покупки.

#### Класс Page
Расширяет класс Component. Отвечает за отображение главной страницы приложения.

Поля:

- `protected _catalog: HTMLElement` - контейнер для отображения карточек товаров
- `protected _basket: HTMLButtonElement` - иконка(кнопка), по нажатию на которую открывается модальное окно с корзиной
- `protected _counter: HTMLSpanElement` - html элемент, показывающий количество добавленных товаров в корзину
- `protected _wrapper: HTMLElement` - html элемент, отвечающий за внутренннее содержимое страницы(экран).

Параметры в конструкторе:
- `protected container: HTMLElement` - 
- protected events: IEvents

Также в классе содержатся методы для работы с данными объекта, который формирует класс:

- `set catalog(cards: HTMLElement[]): void` - записывает карточки в _catalog для отображения их на главной странице
- `set counter(value: string): void` - записывает количество добавленных товаров в корзину
- `lockScreen(value: boolean): void` - данный метод служит для блокировки/разблокировки экрана(окна), чтоб не было его прокрутки при открытии/закрытии модального окна.

#### Класс FormOrder
Расширяет класс Form. Первое окно при оформлении заказа. Форма для указания способа оплаты и адреса доставки.

Поля:

- `protected containerButtons: HTMLDivElement` - контейнер, содержащий кнопки "онлайн" и "при получении"
- `protected buttonCard: HTMLButtonElement` - кнопка "онлайн"
- `protected buttonCash: HTMLButtonElement` - кнопка "при получении"
- `protected inputAddress: HTMLInputElement` - поле для ввода адреса покупателя.

Параметры в конструкторе:

параметры `Form`.

Также в классе содержатся методы для работы с данными объекта, который формирует класс:

- `protected getButtonActive(): HTMLButtonElement | null` - служебный метод: возвращает кнопку, которая активна, либо null, если нет активной кнопки
- `protected resetButtons(): void` - служебный метод: очищает класс активности с кнопок "Онлайн" и "При получении"
- `clear(): void` - Очищает форму и снимает класс активности с кнопок
- `get payment(): TPayment | null` - возвращает имя активной кнопки (нужно для записи способа покупки), либо null
- `get address(): string` - возвращает адрес покупателя
- `get valid(): boolean` - возвращает валидность формы. В данном случае форма валидна, если была нажата одна из кнопок и в поле ввода не пустое значение. Также записывается текст ошибки
`set valid(value: boolean):void` - запись для блокировки (true) / разблокировки (false) кнопки submit.

#### Класс FormContacts
Расширяет класс Form. Второе окно при оформлении заказа. Форма для указания телефона и email покупателя.

Поля

- `protected inputEmail: HTMLInputElement` - текстовое поле для email
- `protected inputPhone: HTMLInputElement` - текстовое поле для номера телефона.

Параметры в конструкторе:

параметры `Form`.

Также в классе содержатся методы для работы с данными объекта, который формирует класс:

- `get email(): string` - возвращает email из поля ввода email
- `get phone(): string` - возвращает номер телефона из поля ввода phone
- `get valid(): boolean` - возвращает валидность формы. В данном случае форма валидна, если все поля заполнены. Также записывается текст ошибки
- `set valid(value: boolean):void` - запись для блокировки (true) / разблокировки (false) кнопки submit.

#### Класс Success
Наследует класс View. Третье и последнее окно при оформлении заказа. Уведомление об успешной покупке, содержит кнопку закрытия "за новыми покупками!".

Поля

- `protected buttonOrderSuccess: HTMLButtonElement` - кнопка "За новыми покупками"
- `protected _totalSum: HTMLParagraphElement` - html элемент, отвечающий за показ потраченных средств за все покупки.

Параметры в конструкторе:

параметры `View`

Также в классе содержатся методы для работы с данными объекта, который формирует класс:

- `set totalSum(total: string): void` - устанавливает количество потраченных средств в html элемент _description.

### Слой коммуникации

#### Класс AppApi

Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

Также в классе содержатся методы для работы с данными объекта, который формирует класс:

- `getProducts(): Promise<ICard[]>` - получает с сервера массив объектов всех товаров
- `getProductById(id: string): Promise<ICard>` - получает с сервера конкретный товар по id
- `postOrder(order: IOrder): Promise<TSuccessData>` - отправляет post запрос на сервер, содержащий данные о заказе и получает по итогу номер заказа (id) и общую сумму заказ (total).

## Взаимодействие компонентов - слой Presenter
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts` В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

Список событий, которые могут генерироваться в системе:

*События изменения данных (генерируются классами __моделями данных__):*
- `cards:changed` - изменение массива данных продуктов
- `purchases:changed` - изменение массива покупок(добавленные товары покупателем в корзину)
- `success:changed` - событие, возникающее при получении(изменении) данных успешного заказа.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются __классами, отвечающими за представление__):*

- `modal:open` - событие, срабатывающее при открытии модального окна
- `modal:close` - событие, срабатывающее при закрытии модального окна
- `modal-card:open` - выбор карточки для отображения в модальном окне
- `modal-basket:open` - открытие модального окна для отображения корзины
- `purchases:add` - событие при добавлении товара в корзину покупателя
- `purchases:delete` - событие при удалении товара из корзины покупателя
- `basket:submit` - переход к оформлению товаров в корзине
- `modal-order:open` - открытие модального окна со способом оплаты
- `order:valid` - событие, возникающее при действиях покупателя с полями формы со способом оплаты
- `order:submit` - событие, возникающее при успешном прохождении формы оплаты и адреса
- `contacts:valid` - событие, возникающее при действиях покупателя с полями формы контактных данных
- `contacts:submit` - событие, возникающее при успешном прохождении формы контактных данных.
- `success: submit` - событие, возникающее при успешном оформлении заказа, а также возвращения к списку продуктов после успешного оформления заказа
