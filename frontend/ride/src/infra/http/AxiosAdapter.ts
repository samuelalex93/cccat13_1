import axios from "axios";
import type HttpClient from "./HttpClient";

export default class AxiosAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (e: any) {
      throw new Error(e.response.data.message);
    }
  }
  async post(url: string, body: any): Promise<any> {
    try {
      const response = await axios.post(url, body);
      return response.data;
    } catch (e: any) {
      throw new Error(e.response.data.message);
    }
  }
}
