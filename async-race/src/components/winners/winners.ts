import { Cars } from '../garage/garage-elements/garage';
import { WinnerServices } from '../services/WinnerService';
import { GarageServices } from '../services/GarageService';
import { getCarSvg } from '../garage/garage-elements/carSvg';

import './winners.css';

type WinnerType = {
  id: number;
  wins: number;
  time: number;
};

export class Winners {
  private readonly WINNER_SERVICES: WinnerServices = new WinnerServices();

  private readonly GARAGE_SERVICES: GarageServices = new GarageServices();

  public async createWinnersLayout(): Promise<DocumentFragment> {
    const fragment = document.createDocumentFragment();

    const winnersList = await this.WINNER_SERVICES.getWinnerList();

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
      const car: Cars = await this.GARAGE_SERVICES.getCar(`${item.id}`);

      const trbody = document.createElement('tr');

      const tdNumber = document.createElement('td');
      tdNumber.innerText = `${index + 1}`;

      const tdCar = document.createElement('td');
      tdCar.innerHTML = getCarSvg(car.color);

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
}
