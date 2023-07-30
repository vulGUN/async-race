import { ControlElements } from '../components/garage/control-elements/controlElements';
import { Garage } from '../components/garage/garage-elements/garage';
import { Winners } from '../components/winners/winners';
import { checkQuerySelector } from '../utils/checkQuerySelector';

export class App {
  private readonly GARAGE: Garage = new Garage();

  private readonly CONTROL_ELEMENTS: ControlElements = new ControlElements(this.GARAGE);

  private readonly WINNERS: Winners = new Winners();

  public async init(): Promise<void> {
    const container = checkQuerySelector('#container');

    container.appendChild(this.CONTROL_ELEMENTS.createPageBtn());
    container.appendChild(await this.CONTROL_ELEMENTS.createControlElementsLayout());
    container.appendChild(await this.GARAGE.createGarageLayout());

    const garagePageBtn = checkQuerySelector('.page-button__garage');
    const winnersPageBtn = checkQuerySelector('.page-button__winners');

    garagePageBtn.addEventListener('click', async () => {
      const controls = document.querySelector('.controls');
      const garage = document.querySelector('.garage');
      const winners = document.querySelector('.winners');

      if (winners) {
        container.removeChild(winners);
      }
      if (controls) {
        container.removeChild(controls);
      }
      if (garage) {
        container.removeChild(garage);
      }

      container.appendChild(await this.CONTROL_ELEMENTS.createControlElementsLayout());
      container.appendChild(await this.GARAGE.createGarageLayout());
    });

    winnersPageBtn.addEventListener('click', async () => {
      const controls = document.querySelector('.controls');
      const garage = document.querySelector('.garage');

      if (controls) {
        container.removeChild(controls);
      }
      if (garage) {
        container.removeChild(garage);
      }

      container.appendChild(await this.WINNERS.createWinnersLayout());
    });
  }
}
