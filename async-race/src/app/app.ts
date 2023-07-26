import { ControlElements } from '../components/garage/control-elements/controlElements';
import { Garage } from '../components/garage/garage/garage';
import { checkQuerySelector } from '../utils/checkQuerySelector';
import { Winners } from '../components/winners/winners';

export class App {
  private garage: Garage = new Garage();

  private controlElements: ControlElements = new ControlElements(this.garage);

  private winners: Winners = new Winners(this.garage);

  public async init(): Promise<void> {
    const container = checkQuerySelector('#container');

    container.appendChild(this.controlElements.createPageBtn());
    container.appendChild(await this.controlElements.createControlElementsLayout());
    container.appendChild(await this.garage.createGarageLayout());

    const garagePageBtn = checkQuerySelector('.page-button__garage');
    const winnersPageBtn = checkQuerySelector('.page-button__winners');

    garagePageBtn.addEventListener('click', async () => {
      const controls = document.querySelector('.controls');
      const garage = document.querySelector('.garage');
      const winners = document.querySelector('.winners');

      if (winners) container.removeChild(winners);
      if (controls) container.removeChild(controls);
      if (garage) container.removeChild(garage);

      container.appendChild(await this.controlElements.createControlElementsLayout());
      container.appendChild(await this.garage.createGarageLayout());
    });

    winnersPageBtn.addEventListener('click', async () => {
      const controls = document.querySelector('.controls');
      const garage = document.querySelector('.garage');

      if (controls) container.removeChild(controls);
      if (garage) container.removeChild(garage);

      container.appendChild(await this.winners.createWinnersLayout());
    });
  }
}
