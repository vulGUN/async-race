import './winners.css';
import { Garage, Cars } from '../garage/garage/garage';

type WinnerType = {
  id: number;
  wins: number;
  time: number;
};

export class Winners {
  private readonly GARAGE: Garage = new Garage();

  private readonly SERVER_URL: string = 'http://localhost:3000';

  private readonly WINNERS_PATH: string = '/winners';

  public async createWinnersLayout(): Promise<DocumentFragment> {
    const fragment = document.createDocumentFragment();

    const winnersList = await this.getWinners();

    const winnersContainer = document.createElement('div');
    winnersContainer.classList.add('winners');

    const title = document.createElement('div');
    title.classList.add('winners__title');
    title.innerText = `Winners (${winnersList.length})`;

    const winnersTable = document.createElement('table');
    winnersTable.classList.add('winners__table');

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');

    const thNumber = document.createElement('th');
    thNumber.innerText = 'Number';

    const thCar = document.createElement('th');
    thCar.innerText = 'Car';

    const thName = document.createElement('th');
    thName.innerText = 'Name';

    const thWins = document.createElement('th');
    thWins.innerText = 'Wins';

    const thTime = document.createElement('th');
    thTime.innerText = 'Best time (seconds)';

    const tbody = this.addWinnersToTable(winnersList);

    trHead.append(thNumber, thCar, thName, thWins, thTime);
    thead.append(trHead);
    winnersTable.append(thead, tbody);

    winnersContainer.append(title, winnersTable);
    fragment.appendChild(winnersContainer);

    return fragment;
  }

  private addWinnersToTable(list: WinnerType[]): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const tbody = document.createElement('tbody');

    list.forEach(async (item, index) => {
      const car: Cars = await this.GARAGE.getCar(`${item.id}`);

      const trbody = document.createElement('tr');

      const tdNumber = document.createElement('td');
      tdNumber.innerText = `${index + 1}`;

      const tdCar = document.createElement('td');
      const svgCode = `
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
      width="60.000000pt" height="20.000000pt" viewBox="0 0 509.000000 139.000000"
      preserveAspectRatio="xMidYMid meet">
     
      <g transform="translate(0.000000,159.000000) scale(0.100000,-0.100000)"
      fill="${car.color}" stroke="none">
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
      tdCar.innerHTML = svgCode;

      const tdName = document.createElement('td');
      tdName.innerText = `${car.name}`;

      const tdWins = document.createElement('td');
      tdWins.innerText = `${item.wins}`;

      const tdTime = document.createElement('td');
      tdTime.innerText = `${item.time}`;

      trbody.append(tdNumber, tdCar, tdName, tdWins, tdTime);
      tbody.appendChild(trbody);
    });

    fragment.appendChild(tbody);

    return fragment;
  }

  public async getWinners(): Promise<WinnerType[]> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}`;
    const response: Response = await fetch(url);
    const winnerList = await response.json();

    console.log(winnerList);

    return winnerList;
  }

  public async getWinner(id: number): Promise<WinnerType> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}/${id}`;
    const response: Response = await fetch(url);
    const winner = await response.json();

    console.log(winner);

    return winner;
  }

  public async createWinner(id: number): Promise<Response> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}/${id}`;
    const response: Response = await fetch(url, {
      method: 'POST',
      // body: JSON.stringify({ id: this.inputCarName, wins: this.inputCarColor, time: 10 }),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(response);

    return response;
  }
}
