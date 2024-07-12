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

#### Класc Api
Класс `Api` предоставляет удобный интерфейс для выполнения HTTP-запросов к заданному базовому URL с использованием Fetch API. Поддерживаются методы `GET`, `POST`, `PUT` и `DELETE`, а также обработка сериализации данных в формате JSON и обработка ошибок.

Конструктор

`constructor(baseUrl: string, options: RequestInit = {})`

- Параметры:
  - `baseUrl (string)`: Базовый URL конечной точки API.
  - `options (RequestInit)`: Дополнительные параметры для настройки HTTP-запросов, такие как заголовки.

- Описание:\
  Инициализирует экземпляр класса Api с базовым URL и опциональными настройками для HTTP-запросов.

- Свойства

`baseUrl: string`

- Описание:\
  Базовый URL конечной точки API, к которой будут отправляться запросы.

`options: RequestInit`

- Описание:\
  Параметры конфигурации для HTTP-запросов, включая заголовки и другие настройки.

- Методы

`get<T>(uri: string): Promise<T>`

- Параметры:

  - `uri (string)`: Путь к конечной точке относительно baseUrl, к которой будет отправлен GET-запрос.

- Возвращает:

  - `Promise`, который разрешается с данными ответа в формате JSON типа T.

- Описание:\
  Отправляет GET-запрос к указанному uri, добавленному к baseUrl. Логирует URL запроса перед отправкой и обрабатывает ответ с помощью метода handleResponse.

`post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T>`

- Параметры:
  - `uri (string)`: Путь к конечной точке относительно baseUrl, к которой будет отправлен POST-запрос.
  - `data (object)`: Данные, которые будут отправлены в теле запроса в формате JSON.
method (ApiPostMethods, опционально): HTTP-метод (POST, PUT или DELETE) для запроса. По умолчанию установлен как 'POST'.
- Возвращает:\
`Promise`, который разрешается с данными ответа в формате JSON типа T.

- Описание:\
  Отправляет POST, PUT или DELETE запрос (в зависимости от параметра method) к указанному uri, добавленному к baseUrl. Логирует метод и URL запроса перед отправкой, включает сериализованные данные data в теле запроса и обрабатывает ответ с помощью метода handleResponse.

`handleResponse<T>(response: Response): Promise<T>`

- Параметры:

  - `response (Response)`: Объект HTTP-ответа, возвращаемый Fetch API.

- Возвращает:\
`Promise`, который разрешается с данными ответа в формате JSON типа T, если ответ успешен (response.ok равно true). В противном случае отклоняется с ошибкой, полученной от сервера, или текстом статуса HTTP.

- Описание:\
  Обрабатывает HTTP-ответ, разбирая JSON-данные при успешном ответе. Если ответ указывает на ошибку (response.ok равно false), отклоняет обещание с ошибкой, полученной от сервера, или текстом статуса HTTP.

- Типы
`ApiListResponse<Type>`

- Описание:\
  Определяет структуру ответов API, которые включают список элементов типа Type и общее количество (total).

`ApiPostMethods`
- Описание:\
  Объединенный тип, представляющий HTTP-методы (POST, PUT, DELETE), которые изменяют данные.

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
Абстрактный базовый класс для моделей, который включает механизм уведомлений об изменениях с использованием брокера событий.

Параметры конструктора:

- `protected events: IEvents` - экземпляр брокера событий для управления событиями.

Методы:

- `emitChanges(event: string, payload?: object): void` - уведомляет всех подписчиков об изменениях в модели, отправляя событие с указанным именем и данными.

#### Класс CardsData
Расширяет класс Model и реализует интерфейс `ICardsData` для управления данными о карточках продуктов.

Поля:

- `protected _cards: IProduct[]` - массив карточек продуктов.

Параметры конструктора:

- `constructor(events: IEvents)` - инициализирует экземпляр класса с заданным брокером событий и пустым массивом карточек.

Методы:

- `set cards(data: IProduct[])` - устанавливает массив карточек продуктов и инициирует событие `cards:changed` с новыми данными.
- `get cards() `- возвращает текущий массив карточек продуктов.
- `getCard(productId: string): IProduct | undefined` - возвращает карточку продукта по заданному идентификатору. Если продукт не найден, выбрасывает ошибку.

#### Класс BasketData
Расширяет класс Model и реализует интерфейс IBasketData для управления данными корзины продуктов.

Поля:

- `protected _cardsInBasket: IProduct[]` - массив продуктов в корзине.
- `protected _total: number` - общая стоимость продуктов в корзине.

Параметры конструктора:

- `constructor(protected events: IEvents)` - инициализирует экземпляр класса с заданным брокером событий и очищенной корзиной.

Методы:

- `isInBasket(productId: string): boolean` - проверяет, находится ли продукт с заданным идентификатором в корзине.
- `getProductsInBasket(): IProduct[]` - возвращает массив продуктов, находящихся в корзине.
- `addProductInBasket(product: IProduct): void` - добавляет продукт в корзину, если его там еще нет.
- `deleteProductFromBasket(id: string): void` - удаляет продукт из корзины по его идентификатору.
- `clearBasket(): void `- очищает корзину.
- `get cardsInBasket(): IProduct[]` - возвращает текущий массив продуктов в корзине.
- `protected set cardsInBasket(cardsInBasket: IProduct[]): void` - устанавливает массив продуктов в корзине и инициирует событие `basket:changed`.
- `getTotal(): number` - возвращает общую стоимость продуктов в корзине.
- `getProductIdsInBasket(): string[]` - возвращает массив идентификаторов продуктов в корзине.

#### Класс OrderData
Реализует интерфейс IOrderData и управляет данными заказа, включая информацию об оплате и контактные данные пользователя.

Поля:

- `protected _paymentInfo: TModalFormOfPayment` - информация об оплате.
- `protected _contactInfo: TModalFormOfContacts` - контактная информация пользователя.
- `formErrors: FormErrors` - объект для хранения ошибок формы.

Параметры конструктора:

- `constructor(protected events: IEvents)` - инициализирует экземпляр класса с заданным брокером событий и очищенными данными заказа и контактной информации.

Методы:

- `clearOrder(): void` - очищает информацию об оплате, устанавливая пустой адрес и null в методе оплаты.
- `clearUserContacts(): void` - очищает контактную информацию пользователя, устанавливая пустые строки для email и телефона.
- `checkValidation(): boolean` - проверяет валидность данных заказа, заполняет объект formErrors при наличии ошибок и инициирует событие formErrors:change. Возвращает true, если ошибок нет.
- `set paymentInfo(info: TModalFormOfPayment): void` - устанавливает информацию об оплате и проверяет валидность данных. При отсутствии ошибок инициирует событие order:ready.
- `get paymentInfo(): TModalFormOfPayment` - возвращает текущую информацию об оплате.
- `set contactInfo(info: TModalFormOfContacts): void` - устанавливает контактную информацию и проверяет валидность данных. При отсутствии ошибок инициирует событие сontacts:ready.
- `get contactInfo(): TModalFormOfContacts` - возвращает текущую контактную информацию.

### Слой представления - View

#### Класс Component<T>
Базовый класс для всех компонентов, предоставляющий основные инструменты для работы с DOM.

Параметры конструктора
`container: HTMLElement` - корневой DOM-элемент компонента.
`events?: IEvents` - объект событий, если требуется.

Методы
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void`

  - Переключает наличие CSS-класса className у элемента element.
  - force - если указано, принудительно добавляет (true) или удаляет (false) класс.

- `setText(element: HTMLElement, value: unknown): void`

  - Устанавливает текстовое содержимое элемента element значением value.

- `setDisabled(element: HTMLElement, state: boolean): void`

  - Устанавливает состояние блокировки элемента element.
  - state - true для блокировки, false для разблокировки.

- `setHidden(element: HTMLElement): void`

  - Скрывает элемент element (устанавливает display: none).

- `setVisible(element: HTMLElement): void`

  - Показывает элемент element (удаляет свойство display).

- `setImage(element: HTMLImageElement, src: string, alt?: string): void`

  - Устанавливает источник изображения src и альтернативный текст alt для элемента element.

- `render(data?: Partial<T>): HTMLElement`

  - Обновляет свойства компонента значениями из объекта data и возвращает корневой DOM-элемент.


#### Класс Modal
Класс Modal представляет собой компонент модального окна, расширяющий базовый класс Component. Он обеспечивает функциональность открытия, закрытия и обработки событий модального окна.

Параметры конструктора

`container: HTMLElemen`t - корневой DOM-элемент для модального окна.
`events: IEvents` - объект для управления событиями.

Поля

`closeButton: HTMLButtonElemen`t - кнопка закрытия модального окна.
`content: HTMLDivElement` - контейнер для содержимого модального окна.

Методы

`open(): void`

  - Открывает модальное окно, добавляя CSS-класс modal_active к корневому элементу.
  - Добавляет обработчик для события keydown документа для отслеживания нажатия клавиши Escape.
  - Триггерит событие modal:open.
- `close(): void`

  - Закрывает модальное окно, удаляя CSS-класс modal_active из корневого элемента.
  - Удаляет обработчик для события keydown документа.
  - Триггерит событие modal:close.
- `handleEscUp(event: KeyboardEvent): void`

  - Обрабатывает нажатие клавиши Escape для закрытия модального окна.

- `render(obj: HTMLElement): HTMLElement`

  - Заменяет содержимое контейнера content элементом obj.
  - Возвращает корневой элемент контейнера.

#### Класс Card
Класс `Card` представляет собой компонент карточки товара, расширяющий базовый класс `Component`. Он обеспечивает функциональность для отображения и управления карточками товаров, включая отображение информации о товаре и взаимодействие с корзиной покупок.

Параметры конструктора

- `template: HTMLTemplateElement` - шаблон для создания DOM-элемента карточки.
- `events: IEvents` - объект для управления событиями.
- `action?: ICardAction` - объект действий, содержащий обработчик клика для кнопки карточки.

Поля

- `_id: string` - идентификатор товара.
- `_title: HTMLHeadingElement` - элемент заголовка товара.
- `_price: HTMLSpanElement` - элемент цены товара.
- `_image: HTMLImageElement` - элемент изображения товара.
- `_category: HTMLSpanElement` - элемент категории товара.
- `_description: HTMLParagraphElement` - элемент описания товара.
- `button: HTMLButtonElement` - кнопка взаимодействия с товаром (например, добавления/удаления из корзины).
- `_index: HTMLSpanElement` - элемент индекса товара в корзине.

Методы

- `protected categoryClass(name: string): string`

  - Возвращает CSS-класс для категории товара в зависимости от названия категории.

- `set category(category: string)`

  - Устанавливает категорию товара и обновляет соответствующий элемент в DOM.

- `set index(index: number)`

  - Устанавливает индекс товара и обновляет соответствующий элемент в DOM.

- `set id(id: string)`

  - Устанавливает идентификатор товара.

- `set title(title: string)`

  - Устанавливает заголовок товара и обновляет соответствующий элемент в DOM.

- `set price(price: string)`

  - Устанавливает цену товара и обновляет соответствующий элемент в DOM.

- `set description(description: string)`

  - Устанавливает описание товара и обновляет соответствующий элемент в DOM.

- `set image(src: string)`

  - Устанавливает изображение товара и обновляет соответствующий элемент в DOM.

- `set inBasket(state: boolean)`

  - Обновляет текст кнопки в зависимости от состояния товара в корзине

#### Класс Basket
Класс `Basket` представляет собой компонент корзины покупок, расширяющий базовый класс `Component`. Он обеспечивает функциональность для отображения списка товаров в корзине, отображения общей стоимости и обработки событий для оформления заказа.

Параметры конструктора

- `template: HTMLTemplateElement` - шаблон для создания DOM-элемента корзины.
- `events: IEvents` - объект для управления событиями.

Поля

- `_list: HTMLUListElement | null` - элемент списка товаров в корзине.
- `_total: HTMLSpanElement` - элемент для отображения общей стоимости товаров.
- `_button: HTMLButtonElement` - кнопка для оформления заказа.

Методы

- `set list(cards: HTMLElement[])`

  - Устанавливает список товаров в корзине, заменяя содержимое элемента списка.

- `set total(total: number)`

  - Устанавливает общую стоимость товаров в корзине и обновляет соответствующий элемент в DOM.
  - Отключает кнопку оформления заказа, если общая стоимость равна или меньше 0.

#### Класс Page
Класс Page представляет собой компонент страницы, который расширяет базовый класс Component. Он обеспечивает функциональность для управления содержимым страницы, включая каталог товаров и корзину покупок.

Параметры конструктора

- `container: HTMLElement` - корневой элемент контейнера страницы.
- `events: IEvents` - объект для управления событиями.

Поля

- `_catalog: HTMLElement` - элемент для отображения каталога товаров.
- `_wrapper: HTMLElement` - элемент обертки страницы.
- `_basket: HTMLButtonElement` - кнопка для открытия корзины.
- `_counter: HTMLSpanElement` - элемент для отображения счетчика товаров в корзине.

Методы

- `set locked(value: boolean)`

  - Устанавливает или снимает блокировку страницы, добавляя или удаляя CSS-класс `page__wrapper_locked` у элемента обертки.

- `set catalog(cards: HTMLElement[])`

  - Обновляет содержимое каталога товаров, заменяя элементы в контейнере каталога.

- `set counter(value: number)`

  - Обновляет значение счетчика товаров в корзине.

#### Класс Form
Класс `Form` представляет собой компонент формы, который расширяет базовый класс `Component`. Он обеспечивает функциональность для работы с элементами формы, включая управление валидацией, отображением ошибок и обработку событий отправки и ввод

Поля:

- `protected inputsList: HTMLInputElement[]` - массив полей ввода (input) формы.
- `protected submitButton: HTMLButtonElement` - кнопка отправки формы.
- `protected _errors: HTMLSpanElement` - элемент для отображения ошибок валидации формы.

Параметры в конструкторе:

- `protected container: HTMLFormElement` - DOM элемент формы, передающийся в родительский класс.
- `protected events: IEvents` - экземпляр брокера событий.

Также в классе содержатся методы и сеттеры для работы с данными формы:

- `set valid(value: boolean)` - управляет состоянием активности кнопки отправки формы. Если значение true, кнопка активна; если false, кнопка неактивна.
set errors(value: string) - устанавливает текст ошибок в элемент _errors.

Методы:

- `render(data: Partial<T> & TForm): HTMLElement` - рендерит форму на основе переданных данных. Устанавливает валидность формы и вызывает метод render родительского класса для отображения остальных данных.

#### Класс FormPayment
Расширяет класс `Form`. Отвечает за взаимодействие и управление формой выбора способа оплаты и добавления адреса доставки.

Поля:

- `protected containerButtons: HTMLDivElement` - контейнер для кнопок выбора способа оплаты.
- `protected buttonCard: HTMLButtonElement` - кнопка выбора оплаты картой.
- `protected buttonCash: HTMLButtonElement` - кнопка выбора оплаты наличными.
- `protected inputAddress: HTMLInputElement `- поле ввода адреса.
- `protected orderButtonElement: HTMLButtonElement` - кнопка отправки заказа.
- `protected _payment: TPayment | null` - выбранный способ оплаты.

Параметры в конструкторе:

- `protected container: HTMLFormElement` - DOM элемент формы, передающийся в родительский класс.
- `protected events: IEvents` - экземпляр брокера событий.

Также в классе содержатся методы и сеттеры для работы с данными формы оплаты:

- `set address(value: string)` - устанавливает значение адреса в поле ввода.
- `get address(): string` - возвращает текущее значение адреса из поля ввода.
- `get payment()` - возвращает текущий выбранный способ оплаты.
- `protected set payment(value: TPayment | null)` - устанавливает выбранный способ оплаты и обновляет стили кнопок.

Методы:

- `private handlePaymentButtonClick(event: MouseEvent)` - обработчик нажатия на кнопки выбора способа оплаты. Устанавливает выбранный способ оплаты и вызывает событие валидации формы.

#### Класс FormContacts
Расширяет класс `Form`. Отвечает за взаимодействие и управление формой контактов. Позволяет ввести почту и телефон покупателя.

Поля:

- `protected inputEmail: HTMLInputElement` - поле ввода электронной почты.
- `protected inputPhone: HTMLInputElement` - поле ввода номера телефона.

Параметры в конструкторе:

- `protected container: HTMLFormElement` - DOM элемент формы, передающийся в родительский класс.
- `events: IEvents` - экземпляр брокера событий.

Также в классе содержатся сеттеры и геттеры для работы с данными формы контактов:

- `set phone(value: string)` - устанавливает значение номера телефона в поле ввода.
- `get phone(): string` - возвращает текущее значение номера телефона из поля ввода.
- `set email(value: string)` - устанавливает значение электронной почты в поле ввода.
- `get email(): string` - возвращает текущее значение электронной почты из поля ввода.


#### Класс Success
Расширяет класс `Component`. Отвечает за отображение и управление модальным окном успешного завершения заказа. Отображает итоговую сумму заказа.

Поля:

- `protected _total: HTMLParagraphElement` - элемент для отображения общей суммы, списанной за заказ.
- `protected buttonOrderSuccess: HTMLButtonElement` - кнопка для закрытия модального окна успешного завершения заказа.

Параметры в конструкторе:

- `protected template: HTMLTemplateElement` - шаблон для клонирования элементов.
- `protected events: IEvents` - экземпляр брокера событий.
Также в классе содержатся сеттеры для работы с данными компонента:

- `set total(value: string)` - устанавливает текстовое значение общей суммы, списанной за заказ.

Методы:

- `private setText(element: HTMLElement, text: string)` - устанавливает текстовое содержание элемента.

### Слой коммуникации


#### Класс AppApi

Расширяет класс Api. Отвечает за взаимодействие с API приложения получает с бэкенда карточки товаров и отправляет сформированный объект заказа на сервер.

Интерфейсы:

- `IAppApi` - интерфейс для методов API приложения.
- `IProduct` - интерфейс данных продукта.
- `IOrder` - интерфейс данных заказа.
- `TSuccessData` - тип данных успешного ответа на размещение заказа.

Поля:

- `readonly cdn: string` - URL для загрузки изображений продуктов.
Параметры в конструкторе:

- `cdn: string` - URL для загрузки изображений продуктов.
- `baseUrl: string` - базовый URL для API запросов.
- `options?: RequestInit` - опциональные параметры для запросов.

Методы:

- `getProducts(): Promise<IProduct[]>` - получает список продуктов с API, добавляет URL изображений из CDN.
- `getProductById(id: string): Promise<IProduct>` - получает данные продукта по его ID, добавляет URL изображения из CDN.
- `postOrder(order: IOrder): Promise<TSuccessData>` - отправляет заказ на сервер и возвращает данные успешного ответа.

## Взаимодействие компонентов - слой Presenter
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.

В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

Список событий, которые могут генерироваться в системе:

*События изменения данных (генерируются классами __моделями данных__):*
- `cards:changed` - изменение массива данных продуктов
- `basket:changed` - изменение массива покупок(добавленные товары покупателем в корзину)

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются __классами, отвечающими за представление__):*

- `formErrors:change` - событие отображение ошибки по состоянию валидности полей формы оформления заказа (для двух эапов)
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `preview:selected` - выбрана карточка в списке для предварительно просмотра с возможностью добавления в корзину
- `preview:submit` -  добавление / удаление товара из корзны через модальное окно просмотра товара
- `basket:delete` - удаление товара из корзины
- `basket:submit` - переход к оформлению товаров в корзине
- `order:valid` - событие, сообщающее о необходимости валидации формы оплаты
- `contacts:valid` - событие, сообщающее о необходимости валидации формы контактных данных покупателя
- `order:submit` - сохраняет способ оплаты и адрес доставки и осуществляет переход на следующий этап оформления заказа
- `contacts:submit` - сохраняет email и номер телефона покупателя и осуществляет переход на следующий этап оформления заказа
- `success: submit` - возврат к списку продуктов после успешного оформления заказа
