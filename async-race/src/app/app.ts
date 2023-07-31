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
      const winners = checkQuerySelector('.winners');

      container.removeChild(winners);

      container.appendChild(await this.CONTROL_ELEMENTS.createControlElementsLayout());
      container.appendChild(await this.GARAGE.createGarageLayout());
    });

    winnersPageBtn.addEventListener('click', async () => {
      const controls = checkQuerySelector('.controls');
      const garage = checkQuerySelector('.garage');

      container.removeChild(controls);
      container.removeChild(garage);

      container.appendChild(await this.WINNERS.createWinnersLayout());
    });
  }
}
