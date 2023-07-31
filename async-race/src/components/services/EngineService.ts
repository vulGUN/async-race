import { CommonService } from './CommonService';

type Engine = {
  velocity: number;
  distance: number;
};

export type EngineStatusType = 'started' | 'stopped';

export class EngineServices extends CommonService {
  private readonly ENGINE_PATH: string = '/engine';

  private readonly URL: string;

  constructor() {
    super();
    this.URL = this.API_URL + this.ENGINE_PATH;
  }

  public async startAndStopEngine(id: number, status: EngineStatusType): Promise<Engine> {
    const url = `${this.URL}/?id=${id}&status=${status}`;

    const response: Response = await fetch(url, { method: 'PATCH' });
    const engine: Engine = await response.json();

    return engine;
  }

  public async switchToDriveMode(id: number): Promise<void> {
    const url = `${this.URL}/?id=${id}&status=drive`;

    try {
      const response = await fetch(url, { method: 'PATCH' });

      if (!response.ok) {
        throw new Error('Engine broken');
      }
    } catch (error) {
      console.error('Car stopped', error);
    }
  }
}
