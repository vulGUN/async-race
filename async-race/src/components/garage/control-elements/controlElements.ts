import './controlElements.css';
// import { checkQuerySelector } from '../../../utils/checkQuerySelector';

export class ControlElements {
  private readonly CREATE_BTN_TEXT = 'Create';

  private readonly UPDATE_BTN_TEXT = 'Update';

  private readonly RACE_BTN_TEXT = 'Race';

  private readonly RESET_BTN_TEXT = 'Reset';

  private readonly GENERATE_CARS_BTN_TEXT = 'Generate cars';

  public createControlElementsLayout(): DocumentFragment {
    const fragment: DocumentFragment = document.createDocumentFragment();

    const controls: HTMLDivElement = document.createElement('div');
    controls.classList.add('controls');

    const createItems: HTMLElement = this.createAddItems();
    const updateItems: HTMLElement = this.createUpdateItems();
    const btnItems: HTMLElement = this.createBtnItems();

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

    const inputColor: HTMLInputElement = document.createElement('input');
    inputColor.setAttribute('type', 'color');
    inputColor.setAttribute('value', randomColor);
    inputColor.classList.add('controls-create__input-color');

    const createButton: HTMLElement = document.createElement('div');
    createButton.classList.add('controls-create__button', 'button');
    createButton.textContent = this.CREATE_BTN_TEXT.toUpperCase();

    controlsCreateWrapper.append(inputName, inputColor, createButton);

    return controlsCreateWrapper;
  }

  private createUpdateItems(): HTMLElement {
    const controlsUpdateWrapper: HTMLDivElement = document.createElement('div');
    controlsUpdateWrapper.classList.add('controls-update');

    const randomColor: string = this.getRandomColor();

    const inputName: HTMLInputElement = document.createElement('input');
    inputName.setAttribute('type', 'text');
    inputName.classList.add('controls-update__input-text');

    const inputColor: HTMLInputElement = document.createElement('input');
    inputColor.setAttribute('type', 'color');
    inputColor.setAttribute('value', randomColor);
    inputColor.classList.add('controls-update__input-color');

    const updateButton: HTMLElement = document.createElement('div');
    updateButton.classList.add('controls-update__button', 'button');
    updateButton.textContent = this.UPDATE_BTN_TEXT.toUpperCase();

    controlsUpdateWrapper.append(inputName, inputColor, updateButton);

    return controlsUpdateWrapper;
  }

  private createBtnItems(): HTMLElement {
    const controlsBtnWrapper: HTMLDivElement = document.createElement('div');
    controlsBtnWrapper.classList.add('controls-btns');

    const raceButton: HTMLElement = document.createElement('div');
    raceButton.classList.add('controls-btns__race-button', 'button');
    raceButton.textContent = this.RACE_BTN_TEXT.toUpperCase();

    const resetButton: HTMLElement = document.createElement('div');
    resetButton.classList.add('controls-btns__reset-button', 'button');
    resetButton.textContent = this.RESET_BTN_TEXT.toUpperCase();

    const generateCarsButton: HTMLElement = document.createElement('div');
    generateCarsButton.classList.add('controls-btns__generate-cars-button', 'button');
    generateCarsButton.textContent = this.GENERATE_CARS_BTN_TEXT.toUpperCase();

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

  public pressInputBtn(): void {
    const btns: NodeListOf<Element> = document.querySelectorAll('.button');

    btns.forEach((item) => {
      item.addEventListener('mousedown', (event) => {
        const { target } = event;

        if (target instanceof HTMLElement) {
          target.classList.add('press-down');
        }
      });

      item.addEventListener('mouseup', (event) => {
        const { target } = event;

        if (target instanceof HTMLElement) {
          target.classList.remove('press-down');
        }
      });
    });
  }
}
