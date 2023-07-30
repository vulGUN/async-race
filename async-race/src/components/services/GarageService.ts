import { checkQuerySelector } from '../../utils/checkQuerySelector';

export type Cars = {
  id: number;
  color: string;
  name: string;
};

export class GarageServices {
  private readonly SERVER_URL: string = 'http://localhost:3000';

  private readonly GARAGE_PATH: string = '/garage';

  public async getCars(): Promise<Cars[]> {
    const url = `${this.SERVER_URL}${this.GARAGE_PATH}`;
    const response = await fetch(url);
    const carsList = await response.json();

    return carsList;
  }

  public async getCar(id: string): Promise<Cars> {
    const url = `${this.SERVER_URL}${this.GARAGE_PATH}/${id}`;
    const response = await fetch(url);
    const car = await response.json();

    return car;
  }

  public async deleteCar(id: string): Promise<void> {
    const url = `${this.SERVER_URL}${this.GARAGE_PATH}/${id}`;

    await fetch(url, { method: 'DELETE' });
  }

  public async createCar(currentName: string, currentColor: string): Promise<void> {
    if (currentName) {
      const url = `${this.SERVER_URL}${this.GARAGE_PATH}`;
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({ name: currentName, color: currentColor }),
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  public async updateCar(id: string): Promise<void> {
    const url = `${this.SERVER_URL}${this.GARAGE_PATH}/${id}`;
    const updateInput: HTMLInputElement = checkQuerySelector('.controls-update__input-text');
    const updateInputColor: HTMLInputElement = checkQuerySelector('.controls-update__input-color');
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ name: updateInput.value, color: updateInputColor.value }),
      headers: { 'Content-Type': 'application/json' },
    });
    updateInput.value = '';
    updateInput.setAttribute('disabled', '');
  }
}
