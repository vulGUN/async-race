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
    const winner: Promise<WinnerType> = await response.json();

    return winner;
  }

  public async updateWinnerData(id: number, time: number): Promise<void> {
    const timeToseconds = time / 1000;

    try {
      const winner = await this.getWinner(id);
      const { time: winnerTime, wins: winnerWins } = winner;
      const updateWins = winnerWins + 1;
      const minTime: number = Math.min(winnerTime, timeToseconds);

      this.updateWinner(id, minTime, updateWins);
    } catch (error) {
      this.createWinner(id, timeToseconds);
    }
  }

  private async createWinner(currentId: number, currentTime: number): Promise<void> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}`;

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ id: currentId, wins: 1, time: currentTime }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async updateWinner(id: number, newTime: number, newWins: number): Promise<void> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}/${id}`;
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ wins: newWins, time: newTime }),
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
