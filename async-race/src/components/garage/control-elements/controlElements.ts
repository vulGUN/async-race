import { Garage, Cars } from '../garage-elements/garage';
import { GarageServices } from '../../services/GarageService';
import { checkQuerySelector } from '../../../utils/checkQuerySelector';
import { CARS_LIST } from '../../сarsList';

import './controlElements.css';

export class ControlElements {
  private readonly GARAGE_SERVICES: GarageServices = new GarageServices();

  private readonly GARAGE: Garage;

  private readonly CREATE_BTN_TEXT = 'Create';

  private readonly UPDATE_BTN_TEXT = 'Update';

  private readonly RACE_BTN_TEXT = 'Race';

  private readonly RESET_BTN_TEXT = 'Reset';

  private readonly GENERATE_CARS_BTN_TEXT = 'Generate cars';

  private readonly MAX_GENERATE_CARS: number = 100;

  private inputCarName = '';

  private inputCarColor = '';

  constructor(garage: Garage) {
    this.GARAGE = garage;
  }

  public async createControlElementsLayout(): Promise<DocumentFragment> {
    const fragment: DocumentFragment = document.createDocumentFragment();

    const controls: HTMLDivElement = document.createElement('div');
    controls.classList.add('controls');

    const createItems: HTMLElement = this.createAddItems();
    const updateItems: HTMLElement = this.createUpdateItems();
    const btnItems: HTMLElement = await this.createBtnItems();

    controls.append(createItems, updateItems, btnItems);
    fragment.append(controls);

    return fragment;
  }

  public createPageBtn(): HTMLElement {
    const pageBtn = document.createElement('div');
    pageBtn.classList.add('page-button');

    const garagePageBtn = document.createElement('div');
    garagePageBtn.classList.add('page-button__garage', 'button');
    garagePageBtn.innerText = 'To garage';
    this.GARAGE.addBtnAnimation(garagePageBtn);

    const winnersPageBtn = document.createElement('div');
    winnersPageBtn.classList.add('page-button__winners', 'button');
    winnersPageBtn.innerText = 'To winners';
    this.GARAGE.addBtnAnimation(winnersPageBtn);

    pageBtn.append(garagePageBtn, winnersPageBtn);

    return pageBtn;
  }

  public getRandomColor(): string {
    let color = '#';

    for (let i = 0; i < 3; i += 1) {
      const randomNum: number = Math.floor(Math.random() * 255 + 1);
      color += randomNum.toString(16).padStart(2, '0').toUpperCase();
    }

    return color;
  }

  public async updateGarageList(): Promise<void> {
    this.GARAGE_SERVICES.getCars();
    const garage = checkQuerySelector('.garage');
    const container = checkQuerySelector('#container');
    container.removeChild(garage);
    container.appendChild(await this.GARAGE.createGarageLayout());
  }

  private createAddItems(): HTMLElement {
    const controlsCreateWrapper: HTMLDivElement = document.createElement('div');
    controlsCreateWrapper.classList.add('controls-create');

    const randomColor: string = this.getRandomColor();

    const inputName: HTMLInputElement = document.createElement('input');
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('placeholder', 'Сar name');
    inputName.classList.add('controls-create__input-text');
    inputName.addEventListener('input', (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        const { value } = event.target;
        this.inputCarName = value;
      }
    });

    const inputColor: HTMLInputElement = document.createElement('input');
    inputColor.setAttribute('type', 'color');
    inputColor.setAttribute('value', randomColor);
    inputColor.classList.add('controls-create__input-color');
    this.inputCarColor = inputColor.value;
    inputColor.addEventListener('input', (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        const { value } = event.target;
        this.inputCarColor = value;
      }
    });

    const createButton: HTMLElement = document.createElement('div');
    createButton.classList.add('controls-create__button', 'button');
    createButton.textContent = this.CREATE_BTN_TEXT.toUpperCase();
    createButton.addEventListener('click', () => {
      if (inputName.value) {
        this.GARAGE_SERVICES.createCar(this.inputCarName, this.inputCarColor);
        this.updateGarageList();
        inputName.value = '';
      }
      this.GARAGE.addBtnAnimation(createButton);
    });

    controlsCreateWrapper.append(inputName, inputColor, createButton);

    return controlsCreateWrapper;
  }

  private createUpdateItems(): HTMLElement {
    const controlsUpdateWrapper: HTMLDivElement = document.createElement('div');
    controlsUpdateWrapper.classList.add('controls-update');

    const randomColor: string = this.getRandomColor();

    const inputName: HTMLInputElement = document.createElement('input');
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('disabled', '');
    inputName.classList.add('controls-update__input-text');

    const inputColor: HTMLInputElement = document.createElement('input');
    inputColor.setAttribute('type', 'color');
    inputColor.setAttribute('value', randomColor);
    inputColor.classList.add('controls-update__input-color');

    const updateButton: HTMLElement = document.createElement('div');
    updateButton.classList.add('controls-update__button', 'button');
    updateButton.textContent = this.UPDATE_BTN_TEXT.toUpperCase();
    updateButton.addEventListener('click', () => {
      if (!inputName.hasAttribute('disabled')) {
        const id = this.GARAGE.getCurrentId();
        const colorValue: string = inputColor.value;
        const nameValue: string = inputName.value;

        this.GARAGE_SERVICES.updateCar(id, colorValue, nameValue);
        this.updateGarageList();
        inputName.value = '';
        inputName.setAttribute('disabled', '');
      }
    });
    this.GARAGE.addBtnAnimation(updateButton);

    controlsUpdateWrapper.append(inputName, inputColor, updateButton);

    return controlsUpdateWrapper;
  }

  private async createBtnItems(): Promise<HTMLElement> {
    const carsList: Cars[] = await this.GARAGE.getCarsPerPage();

    const controlsBtnWrapper: HTMLDivElement = document.createElement('div');
    controlsBtnWrapper.classList.add('controls-btns');

    const raceButton: HTMLElement = document.createElement('div');
    raceButton.classList.add('controls-btns__race-button', 'button');
    raceButton.textContent = this.RACE_BTN_TEXT.toUpperCase();
    raceButton.addEventListener('click', () => {
      carsList.forEach((item) => {
        this.GARAGE.startRace(item.id, 'started');
        this.GARAGE.isFinished = false;
      });
    });
    this.GARAGE.addBtnAnimation(raceButton);

    const resetButton: HTMLElement = document.createElement('div');
    resetButton.classList.add('controls-btns__reset-button', 'button');
    resetButton.textContent = this.RESET_BTN_TEXT.toUpperCase();
    resetButton.addEventListener('click', () => {
      carsList.forEach((item) => this.GARAGE.stopDrive(item.id, 'stopped'));
    });
    this.GARAGE.addBtnAnimation(resetButton);

    const generateCarsButton: HTMLElement = document.createElement('div');
    generateCarsButton.classList.add('controls-btns__generate-cars-button', 'button');
    generateCarsButton.textContent = this.GENERATE_CARS_BTN_TEXT.toUpperCase();
    generateCarsButton.addEventListener('click', () => {
      this.generateCars();
    });
    this.GARAGE.addBtnAnimation(generateCarsButton);

    controlsBtnWrapper.append(raceButton, resetButton, generateCarsButton);

    return controlsBtnWrapper;
  }

  private async generateCars(): Promise<void> {
    for (let i = 0; i < this.MAX_GENERATE_CARS; i += 1) {
      const brand = CARS_LIST.brand[Math.floor(Math.random() * 50)];
      const model = CARS_LIST.model[Math.floor(Math.random() * 50)];
      const name = `${brand} ${model}`;
      const color = this.getRandomColor();

      this.GARAGE_SERVICES.createCar(name, color);
    }
    this.updateGarageList();
  }
}
