type Engine = {
  velocity: number;
  distance: number;
};

export class EngineServices {
  private readonly SERVER_URL: string = 'http://localhost:3000';

  private readonly ENGINE_PATH: string = '/engine';

  public async startAndStopEngine(id: number, status: string): Promise<Engine> {
    const url = `${this.SERVER_URL}${this.ENGINE_PATH}/?id=${id}&status=${status}`;

    const response: Response = await fetch(url, { method: 'PATCH' });
    const engine: Engine = await response.json();

    return engine;
  }

  public async switchToDriveMode(id: number): Promise<boolean> {
    const url = `${this.SERVER_URL}${this.ENGINE_PATH}/?id=${id}&status=drive`;

    try {
      const response = await fetch(url, { method: 'PATCH' });

      if (response.ok) {
        return false;
      }
    } catch (error) {
      console.error('Engine broken', error);
    }
    return true;
  }
}
