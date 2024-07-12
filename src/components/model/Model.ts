import { IEvents } from '../base/events';
export abstract class Model {
	constructor(protected events: IEvents) {
		this.events = events;
	}

	// Сообщить всем что модель поменялась
	emitChanges(event: string, payload?: object) {
		// Состав данных можно модифицировать
		this.events.emit(event, payload ?? {});
	}
}
