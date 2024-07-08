# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с TS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
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

Карточка товара

```
export interface ICard {
	_id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	inBasket: boolean;
}
```

Данные заказа для оплаты

```
export interface IOrder {
	methodOfPayment: TPayment;
	address: string;
	email: string;
	phone: string;
	items: string[];
}
```

Интерфейс для хранения модели данных карточек

```
export interface ICardsData {
	products: ICard[];
	preview: string | null;
	getProduct(id: string): ICard | undefined;
}
```

Интерфейс для корзины

```
export interface IBasket {
	purchases: ICard[];
	addPurchase(value: ICard): void;
	deletePurchase(id: string): void;
	getQuantity(): number;
	checkProduct(id: string): boolean;
	getTotal(): number;
	getIdList(): string[];
	clear(): void;
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

### Слой данных

#### Класс CardsData

Класс отвечает за хранение и логику работы с каталогом товаров(карточек).\
Конструктор класса принимает инстант брокера событий.

- `constructor(events: IEvents)`

В полях класса хранятся следующие данные:

- `_cards: IProduct[]` - массив объектов карточек.
- `_preview: string | null;` - id карточки, выбранной для просмотра в модальном окне.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- `getCard(cardId: string): IProduct | undefined` - параметром принимает id карточки и возвращает карточку, соответствующую переданному id.
- `set cards(value: IProduct[]): void` - записывает массив товаров.
- `get cards(): IProduct[]` - возвращает массив товаров.
- `get preview(): string | null` - возвращает выбранную карточку товара.

#### Класс BasketData

Класс отвечает за логику и хранение данных товаров, добавленных в корзину.\
Конструктор класса принимает инстант брокера событий.

`constructor(events: IEvents)`

В полях класса хранятся следующие данные:

- `_purchases: IProduc[]` - коллекция товаров в корзине
- `_total: number` - итоговая стоимость товаров в корзине
- `events: IEvents` - экземпляр класса EventEmitter для инициации событий при изменении данных

Также в классе содержатся методы для работы с данными объекта, который формирует класс

- `addPurchase(product: IProduct): void` - добавляет товар в начало списка в корзине.
- `deletePurchase(id: string): void` - удаляет товар из корзины
- `getQuantity(): number` - возвращает общее количество товаров в корзине.
- `clearBasket(): void` - очищать корзину.
- `getTotal(): number` - устанавливает итоговую стоимость.
- `getIdList(): string[]` - для получения списка товаров в корзине по уникальному идентификатору.
- `get total(value: number): void` - получение общей суммы заказа.
