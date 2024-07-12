export type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
      this.baseUrl = baseUrl;
      this.options = {
          headers: {
              'Content-Type': 'application/json',
              ...(options.headers as object ?? {})
          }
      };
  }

  protected handleResponse<T>(response: Response): Promise<T> {
      return response.json().then(data => {
          if (response.ok) return data;
          else return Promise.reject(data.error ?? response.statusText);
      }).catch(error => {
          return Promise.reject(response.statusText);
      });
  }


  get<T>(uri: string): Promise<T> {
      console.log(`Sending GET request to ${this.baseUrl + uri}`);
      return fetch(this.baseUrl + uri, {
          ...this.options,
          method: 'GET'
      }).then(response => this.handleResponse<T>(response)).catch(error => {
          console.error(`GET request to ${this.baseUrl + uri} failed:, error`);
          throw error;
      });
  }

  post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
      console.log(`Sending ${method} request to ${this.baseUrl + uri} with data:, data`);
      return fetch(this.baseUrl + uri, {
          ...this.options,
          method,
          body: JSON.stringify(data)
      }).then(response => this.handleResponse<T>(response)).catch(error => {
          console.error(`${method} request to ${this.baseUrl + uri} failed:, error`);
          throw error;
      });
  }

}
