export type WinnerType = {
  id: number;
  wins: number;
  time: number;
};

export class WinnerServices {
  private readonly SERVER_URL: string = 'http://localhost:3000';

  private readonly WINNERS_PATH: string = '/winners';

  public async getWinnerList(): Promise<WinnerType[]> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}`;
    const response: Response = await fetch(url);
    const winnerList: Promise<WinnerType[]> = await response.json();

    return winnerList;
  }

  public async getWinner(id: number): Promise<WinnerType> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}/${id}`;
    const response: Response = await fetch(url);

    if (response.status !== 200) {
      throw new Error('No winner found');
    }

    const winner: Promise<WinnerType> = await response.json();

    return winner;
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

  private updateWinnerResult(currentTime: number, lastTime: number, wins: number): object {
    const updateWins: number = wins + 1;
    const minTime: number = Math.min(currentTime, lastTime);

    return { wins: updateWins, time: minTime };
  }

  private async createWinner(currentId: number, currentTime: number): Promise<void> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}`;

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ id: currentId, wins: 1, time: currentTime }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async updateWinner(id: number, result: object): Promise<void> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}/${id}`;
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(result),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
