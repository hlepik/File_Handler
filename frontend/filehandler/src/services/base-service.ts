import Axios, { AxiosError } from "axios";
import { ApiBaseUrl } from "../configuration";
import { IFetchResponse } from "../types/IFetchResponse";


export abstract class BaseService {
  protected static axios = Axios.create({
    baseURL: ApiBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "blob"
  });

  protected static getAxiosConfiguration(token?: string): { headers: { Authorization: string } } | undefined {
    if (!token) return undefined;
    return {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
  }

  static async delete<TEntity>(apiEndpoint: string, token?: string): Promise<IFetchResponse<TEntity>> {
    try {
      let response = await this.axios.delete<TEntity>(apiEndpoint, BaseService.getAxiosConfiguration(token));
      return {
        ok: response.status <= 299,
        statusCode: response.status,
        data: response.data,
      };
    } catch (err) {
      let error = err as AxiosError;
      return {
        ok: false,
        statusCode: error.response?.status ?? 500,
        message: typeof error.response?.data  === 'string'  ? error.response?.data as string : undefined,
      };
    }
  }
}
