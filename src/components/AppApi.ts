import { IOrder } from '../types/model/OrderDataTypes';
import { IProduct } from '../types/model/ProductsDataTypes';
import { TSuccessData } from '../types/view/ModalSuccessViewTypes';
import { ApiListResponse, Api } from './base/api';


export interface IActionAPI {
	getProducts(): Promise<IProduct[]>;
	getProductById(id: string): Promise<IProduct>;
	postOrder(order: IOrder): Promise<TSuccessData>;
}

export class ActionAPI extends Api implements IActionAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts() {
		return this.get('/product').then((cards: ApiListResponse<IProduct>) => {
			return cards.items.map((item) => {
				return { ...item, image: this.cdn + item.image };
			});
		});
	}

	getProductById(id: string) {
		return this.get('/product/' + id).then((product: IProduct) => {
			return { ...product, image: this.cdn + product.image };
		});
	}

	postOrder(order: IOrder) {
		return this.post('/order', order).then((success: TSuccessData) => {
			return success;
		});
	}
}
