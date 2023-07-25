import './controlElements.css';
import { Garage, Cars } from '../garage/garage';
import { checkQuerySelector } from '../../../utils/checkQuerySelector';

export class ControlElements {
  private readonly GARAGE: Garage;

  private readonly SERVER_URL: string = 'http://127.0.0.1:3000';

  private readonly GARAGE_PATH: string = '/garage';

  private readonly CREATE_BTN_TEXT = 'Create';

  private readonly UPDATE_BTN_TEXT = 'Update';

  private readonly RACE_BTN_TEXT = 'Race';

  private readonly RESET_BTN_TEXT = 'Reset';

  private readonly GENERATE_CARS_BTN_TEXT = 'Generate cars';

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
    fragment.appendChild(controls);

    return fragment;
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
      this.createCar();
      this.updateGarageList();
      inputName.value = '';
    });
    this.GARAGE.addBtnAnimation(createButton);

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
        this.updateCar(this.GARAGE.getCurrentId());
        this.updateGarageList();
      }
    });
    this.GARAGE.addBtnAnimation(updateButton);

    controlsUpdateWrapper.append(inputName, inputColor, updateButton);

    return controlsUpdateWrapper;
  }

  private async createBtnItems(): Promise<HTMLElement> {
    const carsList: Cars[] = await this.GARAGE.getCars();

    const controlsBtnWrapper: HTMLDivElement = document.createElement('div');
    controlsBtnWrapper.classList.add('controls-btns');

    const raceButton: HTMLElement = document.createElement('div');
    raceButton.classList.add('controls-btns__race-button', 'button');
    raceButton.textContent = this.RACE_BTN_TEXT.toUpperCase();
    raceButton.addEventListener('click', () => {
      carsList.forEach((item) => this.GARAGE.startAndStopEngine(item.id, 'started'));
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
    this.GARAGE.addBtnAnimation(generateCarsButton);

    controlsBtnWrapper.append(raceButton, resetButton, generateCarsButton);

    return controlsBtnWrapper;
  }

  public getRandomColor(): string {
    let color = '#';

    for (let i = 0; i < 3; i += 1) {
      const randomNum: number = Math.floor(Math.random() * 255 + 1);
      color += randomNum.toString(16).padStart(2, '0').toUpperCase();
    }

    return color;
  }

  // !поправить дублирование класса garage

  public async updateGarageList(): Promise<void> {
    this.GARAGE.getCars();
    const garage = checkQuerySelector('.garage');
    garage.innerHTML = '';
    garage.appendChild(await this.GARAGE.createGarageLayout());
  }

  public async createCar(): Promise<void> {
    if (this.inputCarName) {
      const url = `${this.SERVER_URL}${this.GARAGE_PATH}`;
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({ name: this.inputCarName, color: this.inputCarColor }),
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  public async updateCar(id: string): Promise<void> {
    if (id) {
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
}
