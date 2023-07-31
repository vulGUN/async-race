import { CommonService } from './CommonService';

export type Cars = {
  id: number;
  color: string;
  name: string;
};

export class GarageServices extends CommonService {
  private readonly GARAGE_PATH: string = '/garage';

  private readonly URL: string;

  constructor() {
    super();
    this.URL = this.API_URL + this.GARAGE_PATH;
  }

  public async getCars(): Promise<Cars[]> {
    const response = await fetch(this.URL);
    const carsList = await response.json();

    return carsList;
  }

  public async getCar(id: string): Promise<Cars> {
    const url = `${this.URL}/${id}`;
    const response = await fetch(url);
    const car = await response.json();

    return car;
  }

  public async deleteCar(id: string): Promise<void> {
    const url = `${this.URL}/${id}`;

    await fetch(url, { method: 'DELETE' });
  }

  public async createCar(currentName: string, currentColor: string): Promise<void> {
    const createdCar = { name: currentName, color: currentColor };

    fetch(this.URL, {
      method: 'POST',
      body: JSON.stringify(createdCar),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public async updateCar(id: string, currentColor: string, currentName: string): Promise<void> {
    const url = `${this.URL}/${id}`;
    const createdCar = { name: currentName, color: currentColor };

    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(createdCar),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
