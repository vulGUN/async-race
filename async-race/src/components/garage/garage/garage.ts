import './garage.css';
import { ControlElements } from '../control-elements/controlElements';

export class Garage {
  private controlElements: ControlElements = new ControlElements();

  private readonly REMOVE_TEXT_BTN: string = 'Remove';

  private readonly SELECT_TEXT_BTN: string = 'Select';

  public createGarageLayout(): DocumentFragment {
    const fragment: DocumentFragment = document.createDocumentFragment();

    const garage: HTMLDivElement = document.createElement('div');
    garage.classList.add('garage');

    const garageCount: HTMLDivElement = document.createElement('div');
    garageCount.classList.add('garage__count');
    garageCount.innerText = 'Garage (1)';

    const garagePage: HTMLDivElement = document.createElement('div');
    garagePage.classList.add('garage__page');
    garagePage.innerText = 'Page #1';

    const garageRace = this.createRaceLayout();
    garage.append(garageCount, garagePage, garageRace);
    fragment.appendChild(garage);

    return fragment;
  }

  private createRaceLayout(): DocumentFragment {
    const fragment: DocumentFragment = document.createDocumentFragment();

    const garageRace: HTMLDivElement = document.createElement('div');
    garageRace.classList.add('garage__race');

    const controlsBtns: HTMLDivElement = document.createElement('div');
    controlsBtns.classList.add('garage__controls');

    const selectBtn: HTMLDivElement = document.createElement('div');
    selectBtn.classList.add('garage__select-btn', 'button');
    selectBtn.innerText = this.SELECT_TEXT_BTN.toUpperCase();

    const removeBtn: HTMLDivElement = document.createElement('div');
    removeBtn.classList.add('garage__remove-btn', 'button');
    removeBtn.innerText = this.REMOVE_TEXT_BTN.toUpperCase();

    const carName: HTMLDivElement = document.createElement('div');
    carName.classList.add('garage__car-name');
    carName.innerText = 'Mersedes S500';

    controlsBtns.append(selectBtn, removeBtn, carName);

    const garageDrive: HTMLDivElement = document.createElement('div');
    garageDrive.classList.add('garage__drive');

    const garageDriveBtns: HTMLDivElement = document.createElement('div');
    garageDriveBtns.classList.add('garage__drive-btns');

    const garageDriveStart: HTMLDivElement = document.createElement('div');
    garageDriveStart.classList.add('garage__drive-start-btn');
    garageDriveStart.innerText = 'D';

    const garageDriveStop: HTMLDivElement = document.createElement('div');
    garageDriveStop.classList.add('garage__drive-stop-btn');
    garageDriveStop.innerText = 'S';

    garageDriveBtns.append(garageDriveStart, garageDriveStop);

    // const color = this.controlElements.getRandomColor();
    const car: HTMLElement = document.createElement('div');
    car.classList.add('garage__car');
    car.setAttribute('fill', '#FFFFFF');

    const road: HTMLDivElement = document.createElement('div');
    road.classList.add('garage__road');

    const finish: HTMLDivElement = document.createElement('div');
    finish.classList.add('garage__finish');

    garageDrive.append(garageDriveBtns, car, road, finish);
    garageRace.append(controlsBtns, garageDrive);
    fragment.appendChild(garageRace);

    return fragment;
  }
}
