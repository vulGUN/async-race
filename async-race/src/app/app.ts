import { ControlElements } from '../components/garage/control-elements/controlElements';
import { Garage } from '../components/garage/garage/garage';
import { checkQuerySelector } from '../utils/checkQuerySelector';

export class App {
  private controlElements: ControlElements = new ControlElements();

  private garage: Garage = new Garage();

  public async init(): Promise<void> {
    const container = checkQuerySelector('#container');

    container.appendChild(this.controlElements.createControlElementsLayout());
    container.appendChild(await this.garage.createGarageLayout());

    this.controlElements.pressInputBtn();

    this.garage.setCarName();
    this.garage.setCarColor();
    this.garage.addNewCar();
  }
}
