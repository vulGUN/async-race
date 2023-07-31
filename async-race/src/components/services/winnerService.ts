import { CommonService } from './CommonService';

export type WinnerType = {
  id: number;
  wins: number;
  time: number;
};

type ResultType = {
  wins: number;
  time: number;
};

export class WinnerServices extends CommonService {
  private readonly WINNERS_PATH: string = '/winners';

  private readonly URL: string;

  constructor() {
    super();
    this.URL = this.API_URL + this.WINNERS_PATH;
  }

  public async getWinnerList(): Promise<WinnerType[]> {
    const response: Response = await fetch(this.URL);
    return response.json();
  }

  public async getWinner(id: number): Promise<WinnerType> {
    const url = `${this.URL}/${id}`;
    const response: Response = await fetch(url);

    if (response.status !== 200) {
      throw new Error('No winner found');
    }

    return response.json();
  }

  public async updateWinnerData(id: number, time: number): Promise<void> {
    const lastTimeToSecond = time / 1000;

    try {
      const winner = await this.getWinner(id);
      const { time: winnerTime, wins: winnerWins } = winner;
      const newResult = this.updateWinnerResult(winnerTime, lastTimeToSecond, winnerWins);

      this.updateWinner(id, newResult);
    } catch (error) {
      this.createWinner(id, lastTimeToSecond);
    }
  }

  private updateWinnerResult(currentTime: number, lastTime: number, wins: number): ResultType {
    const updateWins: number = wins + 1;
    const minTime: number = Math.min(currentTime, lastTime);

    return { wins: updateWins, time: minTime };
  }

  private async createWinner(currentId: number, currentTime: number): Promise<void> {
    await fetch(this.URL, {
      method: 'POST',
      body: JSON.stringify({ id: currentId, wins: 1, time: currentTime }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async updateWinner(id: number, result: ResultType): Promise<void> {
    const url = `${this.URL}/${id}`;
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(result),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public async removeWinner(id: string): Promise<void> {
    const url = `${this.URL}/${id}`;

    await fetch(url, { method: 'DELETE' });
  }
}
