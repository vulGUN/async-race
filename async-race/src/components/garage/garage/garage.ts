import './garage.css';
import { checkQuerySelector } from '../../../utils/checkQuerySelector';

type Cars = {
  id: number;
  color: string;
  name: string;
};

export class Garage {
  private readonly SERVER_URL: string = 'http://localhost:3000';

  private readonly GARAGE_PATH: string = '/garage';

  private readonly REMOVE_TEXT_BTN: string = 'Remove';

  // private readonly REMOVE_BTN_SELECTOR: string = 'Remove';

  private readonly SELECT_TEXT_BTN: string = 'Select';

  private currentId = '';

  public async createGarageLayout(): Promise<DocumentFragment> {
    const carsList: Cars[] = await this.getCars();

    const fragment: DocumentFragment = document.createDocumentFragment();

    const garage: HTMLDivElement = document.createElement('div');
    garage.classList.add('garage');

    const garageCount: HTMLDivElement = document.createElement('div');
    garageCount.classList.add('garage__count');
    garageCount.innerText = `Garage (${carsList.length})`;

    const garagePage: HTMLDivElement = document.createElement('div');
    garagePage.classList.add('garage__page');
    garagePage.innerText = 'Page #1';

    const garageRace = this.createRaceLayout(carsList);
    garage.append(garageCount, garagePage, garageRace);
    fragment.appendChild(garage);

    return fragment;
  }

  private createRaceLayout(carsList: Cars[]): DocumentFragment {
    const fragment: DocumentFragment = document.createDocumentFragment();

    carsList.forEach((item) => {
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

      const garageDriveStop: HTMLDivElement = document.createElement('div');
      garageDriveStop.classList.add('garage__drive-stop-btn');
      garageDriveStop.setAttribute('id', `garage__drive-stop-btn-${item.id}`);
      garageDriveStop.innerText = 'R';

      garageDriveBtns.append(garageDriveStart, garageDriveStop);

      const car: HTMLElement = document.createElement('div');
      car.classList.add('garage__car');
      car.setAttribute('id', `garage__car-${item.id}`);
      const svgCode = `
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
          width="60.000000pt" height="20.000000pt" viewBox="0 0 509.000000 159.000000"
          preserveAspectRatio="xMidYMid meet">
         
          <g transform="translate(0.000000,159.000000) scale(0.100000,-0.100000)"
          fill="${item.color}" stroke="none">
          <path d="M1890 1500 c-383 -26 -828 -149 -1180 -325 -75 -38 -122 -55 -165
          -59 l-60 -7 -47 63 -46 63 74 3 c82 3 97 14 74 56 -26 50 -71 63 -297 85 -116
          12 -219 18 -227 15 -25 -9 -19 -52 10 -79 28 -26 81 -45 124 -45 21 0 39 -17
          89 -85 35 -47 62 -88 60 -90 -2 -2 -40 -8 -84 -14 -124 -18 -121 -14 -128
          -183 -5 -145 -21 -238 -40 -238 -6 0 -19 7 -29 17 -17 16 -18 11 -18 -139 0
          -120 3 -158 14 -167 7 -6 16 -29 20 -50 11 -72 84 -135 192 -167 89 -27 247
          -25 354 4 47 13 102 27 123 33 l37 10 -17 32 c-45 88 -54 191 -24 288 76 242
          337 353 567 239 111 -54 197 -173 213 -295 17 -124 -21 -242 -108 -337 l-48
          -53 1256 3 c691 1 1286 3 1324 5 l67 2 -35 49 c-53 74 -76 147 -76 236 0 117
          38 206 122 286 126 118 293 144 454 70 129 -59 225 -215 225 -367 0 -71 -35
          -171 -80 -228 -22 -28 -40 -53 -40 -56 0 -10 324 -5 414 6 132 16 136 18 136
          79 0 48 -2 51 -36 67 -28 14 -34 22 -30 38 34 120 26 268 -21 365 -74 154
          -287 276 -518 297 -52 4 -89 15 -146 44 -54 27 -98 41 -155 48 -118 16 -381
          31 -534 31 l-135 0 -160 86 c-489 260 -640 318 -925 354 -117 14 -402 20 -540
          10z"/>
          <path d="M963 699 c-111 -43 -194 -162 -195 -282 -2 -98 24 -161 96 -232 77
          -76 135 -99 239 -93 90 5 153 34 213 101 144 160 94 406 -101 498 -75 36 -171
          39 -252 8z"/>
          <path d="M4203 679 c-102 -19 -185 -82 -233 -175 -36 -70 -36 -197 0 -269 72
          -147 243 -220 394 -169 63 22 148 101 182 170 53 108 30 249 -55 347 -63 71
          -193 114 -288 96z"/>
          </g>
          </svg>
          `;
      car.innerHTML = svgCode;

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

  public getCurrentId(): string {
    return this.currentId;
  }

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

  public async pressRemoveBtn(event: Event): Promise<void> {
    const { target } = event;

    if (target instanceof HTMLElement) {
      const garage = checkQuerySelector('.garage');
      const id: string = target.id.replace(/\D/g, '');
      this.deleteCar(id);
      this.getCars();
      garage.innerHTML = '';
      garage.appendChild(await this.createGarageLayout());
    }
  }

  public async deleteCar(id: string): Promise<void> {
    const url = `${this.SERVER_URL}${this.GARAGE_PATH}/${id}`;

    fetch(url, { method: 'DELETE' });
  }

  public async pressSelectBtn(event: Event): Promise<void> {
    const { target } = event;

    if (target instanceof HTMLElement) {
      const id: string = target.id.replace(/\D/g, '');
      const car = await this.getCar(id);
      const updateInput: HTMLInputElement = checkQuerySelector('.controls-update__input-text');
      const updateInputColor: HTMLInputElement = checkQuerySelector('.controls-update__input-color');
      updateInput.removeAttribute('disabled');
      this.currentId = id;

      updateInput.value = car.name;
      updateInputColor.value = car.color;
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
}
