import './winners.css';

export class Winners {
  public createWinnersLayout(): DocumentFragment {
    const fragment = document.createDocumentFragment();

    const winnersContainer = document.createElement('div');
    winnersContainer.classList.add('winners');

    const title = document.createElement('div');
    title.classList.add('winners__title');
    title.innerText = `Winners (1)`;

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

    trHead.append(thNumber, thCar, thName, thWins, thTime);
    thead.append(trHead);
    winnersTable.appendChild(thead);

    winnersContainer.append(title, winnersTable);
    fragment.appendChild(winnersContainer);

    return fragment;
  }
}
