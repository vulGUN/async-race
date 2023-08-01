import { checkQuerySelector } from '../../../utils/checkQuerySelector';
import { WinnerServices } from '../../services/WinnerService';
import { GarageServices } from '../../services/GarageService';
import { EngineServices, EngineStatusType } from '../../services/EngineService';
import { getCarSvg } from './carSvg';

import './garage.css';

export type Cars = {
  id: number;
  color: string;
  name: string;
};

export class Garage {
  private readonly REMOVE_TEXT_BTN: string = 'Remove';

  private readonly SELECT_TEXT_BTN: string = 'Select';

  private readonly ENGINE_SERVICES: EngineServices = new EngineServices();

  private readonly WINNER_SERVICES: WinnerServices = new WinnerServices();

  private readonly GARAGE_SERVICES: GarageServices = new GarageServices();

  private readonly MAX_CARS_PER_PAGE: number = 7;

  private readonly ZERO = 0;

  private currentId = '';

  public currentPage = 0;

  public isFinished = false;

  public async getCarsPerPage(): Promise<Cars[]> {
    const carsList: Cars[] = await this.GARAGE_SERVICES.getCars();
    const carsPerPage: Cars[] = this.splitByPages(this.MAX_CARS_PER_PAGE, carsList)[this.currentPage];

    return carsPerPage;
  }

  public async createGarageLayout(): Promise<DocumentFragment> {
    const carsList: Cars[] = await this.GARAGE_SERVICES.getCars();
    const carsPerPageList: Cars[][] = this.splitByPages(this.MAX_CARS_PER_PAGE, carsList);

    const fragment: DocumentFragment = document.createDocumentFragment();

    const garage: HTMLDivElement = document.createElement('div');
    garage.classList.add('garage');

    const garageCount: HTMLDivElement = document.createElement('div');
    garageCount.classList.add('garage__count');
    garageCount.innerText = `Garage (${carsList.length})`;

    const garagePage: HTMLDivElement = document.createElement('div');
    garagePage.classList.add('garage__page');
    garagePage.innerText = `Page #${this.currentPage + 1}`;

    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('garage__pagination');

    const prevPageBtn = document.createElement('div');
    prevPageBtn.classList.add('garage__pagination-prev-btn', 'button');
    prevPageBtn.innerText = 'Prev'.toUpperCase();
    prevPageBtn.addEventListener('click', async () => {
      if (this.currentPage > this.ZERO) {
        this.currentPage -= 1;
        const container = checkQuerySelector('#container');
        container.removeChild(garage);
        container.appendChild(await this.createGarageLayout());
      }
    });
    this.addBtnAnimation(prevPageBtn);

    const nextPageBtn = document.createElement('div');
    nextPageBtn.classList.add('garage__pagination-next-btn', 'button');
    nextPageBtn.innerText = 'Next'.toUpperCase();
    nextPageBtn.addEventListener('click', async () => {
      if (this.currentPage < carsPerPageList.length - 1) {
        this.currentPage += 1;
        const container = checkQuerySelector('#container');
        container.removeChild(garage);
        container.appendChild(await this.createGarageLayout());
      }
    });
    this.addBtnAnimation(nextPageBtn);

    const garageRace: DocumentFragment = this.createRaceLayout(carsPerPageList, this.currentPage);

    paginationContainer.append(prevPageBtn, nextPageBtn);
    garage.append(garageCount, garagePage, garageRace, paginationContainer);
    fragment.appendChild(garage);

    return fragment;
  }

  public getCurrentId(): string {
    return this.currentId;
  }

  public getCurrentPage(): number {
    return this.currentPage;
  }

  public async pressSelectBtn(event: Event): Promise<void> {
    const { target } = event;

    if (target instanceof HTMLElement) {
      const id: string = target.id.replace(/\D/g, '');
      const car = await this.GARAGE_SERVICES.getCar(id);
      const updateInput: HTMLInputElement = checkQuerySelector('.controls-update__input-text');
      const updateInputColor: HTMLInputElement = checkQuerySelector('.controls-update__input-color');
      updateInput.removeAttribute('disabled');
      this.currentId = id;

      updateInput.value = car.name;
      updateInputColor.value = car.color;
    }
  }

  public async startRace(id: number, status: EngineStatusType): Promise<void> {
    const { velocity, distance } = await this.ENGINE_SERVICES.startAndStopEngine(id, status);
    const endPosition = this.getAnimationCoordinates(id);
    const car: HTMLElement = checkQuerySelector(`#garage__car-${id}`);
    const time: number = Math.trunc(distance / velocity);

    let animationStart: number;
    let isEngineBroken = false;

    function animate(timestamp: number): void {
      if (isEngineBroken) {
        return;
      }

      if (!animationStart) {
        animationStart = timestamp;
      }

      const animationTime: number = timestamp - animationStart;

      if (animationTime >= time) {
        car.style.transform = `translateX(${endPosition}px)`;
      } else {
        const progress: number = animationTime / time;
        const newPosition: number = endPosition * progress;
        car.style.transform = `translateX(${newPosition}px)`;

        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);

    try {
      await this.ENGINE_SERVICES.switchToDriveMode(id);
      if (!this.isFinished) {
        this.isFinished = true;
        this.WINNER_SERVICES.updateWinnerData(id, time);
      }
    } catch (error) {
      isEngineBroken = true;
    }
  }

  public async stopDrive(id: number, status: EngineStatusType): Promise<void> {
    const { velocity } = await this.ENGINE_SERVICES.startAndStopEngine(id, status);
    if (!velocity) {
      const car: HTMLElement = checkQuerySelector(`#garage__car-${id}`);
      car.style.transform = `translateX(0)`;
    }
  }

  public addBtnAnimation(element: HTMLElement): void {
    element.addEventListener('mousedown', (event) => {
      const { target } = event;

      if (target instanceof HTMLElement) {
        target.classList.add('press-down');
      }
    });

    element.addEventListener('mouseup', (event) => {
      const { target } = event;

      if (target instanceof HTMLElement) {
        target.classList.remove('press-down');
      }
    });
  }

  private async pressRemoveBtn(event: Event): Promise<void> {
    const { target } = event;

    if (target instanceof HTMLElement) {
      const garage = checkQuerySelector('.garage');
      const container = checkQuerySelector('#container');
      const id: string = target.id.replace(/\D/g, '');
      this.GARAGE_SERVICES.deleteCar(id);
      this.GARAGE_SERVICES.getCars();
      container.removeChild(garage);
      container.appendChild(await this.createGarageLayout());

      const winner = await this.WINNER_SERVICES.getWinner(+id);
      if (winner) {
        this.WINNER_SERVICES.removeWinner(id);
      }
    }
  }

  private getAnimationCoordinates(id: number): number {
    const car: HTMLElement = checkQuerySelector(`#garage__car-${id}`);
    const garage: HTMLElement = checkQuerySelector('.garage');
    const currentWidth: number = garage.clientWidth;
    const styles: CSSStyleDeclaration = window.getComputedStyle(car);
    const leftValue: number = parseFloat(styles.left);

    const endPosition: number = currentWidth - car.offsetWidth - leftValue;

    return endPosition;
  }

  private createRaceLayout(carsList: Cars[][], page: number): DocumentFragment {
    const fragment: DocumentFragment = document.createDocumentFragment();

    carsList[page].forEach((item) => {
      const garageRace: HTMLDivElement = document.createElement('div');
      garageRace.setAttribute('id', `garage__race-${item.id}`);
      garageRace.classList.add('garage__race');

      const controlsBtns: HTMLDivElement = document.createElement('div');
      controlsBtns.classList.add('garage__controls');

      const selectBtn: HTMLDivElement = document.createElement('div');
      selectBtn.classList.add('garage__select-btn', 'button');
      selectBtn.setAttribute('id', `garage__select-btn-${item.id}`);
      selectBtn.innerText = this.SELECT_TEXT_BTN.toUpperCase();
      selectBtn.addEventListener('click', (event: Event) => {
        this.pressSelectBtn(event);
      });
      this.addBtnAnimation(selectBtn);

      const removeBtn: HTMLDivElement = document.createElement('div');
      removeBtn.classList.add('garage__remove-btn', 'button');
      removeBtn.setAttribute('id', `garage__remove-btn-${item.id}`);
      removeBtn.innerText = this.REMOVE_TEXT_BTN.toUpperCase();
      removeBtn.addEventListener('click', (event: Event) => {
        this.pressRemoveBtn(event);
      });
      this.addBtnAnimation(removeBtn);

      const carName: HTMLDivElement = document.createElement('div');
      carName.classList.add('garage__car-name');
      carName.innerText = item.name;

      controlsBtns.append(selectBtn, removeBtn, carName);

      const garageDrive: HTMLDivElement = document.createElement('div');
      garageDrive.classList.add('garage__drive');

      const garageDriveBtns: HTMLDivElement = document.createElement('div');
      garageDriveBtns.classList.add('garage__drive-btns');

      const garageDriveStart: HTMLDivElement = document.createElement('div');
      garageDriveStart.classList.add('garage__drive-start-btn');
      garageDriveStart.setAttribute('id', `garage__drive-start-btn-${item.id}`);
      garageDriveStart.innerText = 'D';
      garageDriveStart.addEventListener('click', () => {
        this.startRace(item.id, 'started');
      });

      const garageDriveStop: HTMLDivElement = document.createElement('div');
      garageDriveStop.classList.add('garage__drive-stop-btn');
      garageDriveStop.setAttribute('id', `garage__drive-stop-btn-${item.id}`);
      garageDriveStop.innerText = 'R';
      garageDriveStop.addEventListener('click', () => {
        this.stopDrive(item.id, 'stopped');
      });

      garageDriveBtns.append(garageDriveStart, garageDriveStop);

      const car: HTMLElement = document.createElement('div');
      car.classList.add('garage__car');
      car.setAttribute('id', `garage__car-${item.id}`);
      car.innerHTML = getCarSvg(item.color);

      const road: HTMLDivElement = document.createElement('div');
      road.classList.add('garage__road');

      const finish: HTMLDivElement = document.createElement('div');
      finish.classList.add('garage__finish');

      garageDrive.append(garageDriveBtns, car, road, finish);
      garageRace.append(controlsBtns, garageDrive);
      fragment.appendChild(garageRace);
    });

    return fragment;
  }

  private splitByPages(carsPerPage: number, carsList: Cars[]): Cars[][] {
    const newCarsList: Cars[][] = [];

    for (let i = 0; i < carsList.length; i += carsPerPage) {
      newCarsList.push(carsList.slice(i, i + carsPerPage));
    }

    return newCarsList;
  }
}
