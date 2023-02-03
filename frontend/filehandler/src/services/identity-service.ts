import { ILoginResponse } from "../types/ILoginResponse";
import Axios, { AxiosError } from "axios";
import { ApiBaseUrl } from "../configuration";
import { IFetchResponse } from "../types/IFetchResponse";

export abstract class IdentityService {
  protected static axios = Axios.create({
    baseURL: ApiBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  static async Login(
    apiEndpoint: string,
    loginData: { email: string; password: string }
  ): Promise<IFetchResponse<ILoginResponse>> {
    let loginDataJson = JSON.stringify(loginData);
    try {
      let response = await this.axios.post<ILoginResponse>(
        apiEndpoint,
        loginDataJson
      );
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
        message: error.response?.data as string,
      };
    }
  }
  static async register(
    apiEndpoint: string,
    loginData: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
    }
  ): Promise<IFetchResponse<ILoginResponse>> {
    let loginDataJson = JSON.stringify(loginData);

    try {
      const response = await this.axios.post<ILoginResponse>(
        apiEndpoint,
        loginDataJson
      );

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
        message: error.response?.data as string,
      };
    }
  }
}
