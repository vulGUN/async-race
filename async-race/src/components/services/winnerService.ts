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
    const winnerList = await response.json();

    return winnerList;
  }

  public async getWinner(id: number): Promise<WinnerType> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}/${id}`;
    const response: Response = await fetch(url);
    const winner = await response.json();

    return winner;
  }

  private async createWinner(currentId: number, currentTime: number): Promise<Response> {
    const url = `${this.SERVER_URL}${this.WINNERS_PATH}`;
    const timeToseconds = currentTime / 1000;

    const response: Response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ id: currentId, wins: 1, time: timeToseconds }),
      headers: { 'Content-Type': 'application/json' },
    });

    return response;
  }

  private async updateWinner(id: number, time: number): Promise<Response> {
    const winnerTime = (await this.getWinner(id)).time;
    let winnerWins = (await this.getWinner(id)).wins;
    const minTimeToseconds = Math.min(winnerTime, time / 1000);

    const url = `${this.SERVER_URL}${this.WINNERS_PATH}/${id}`;
    const response: Response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ wins: (winnerWins += 1), time: minTimeToseconds }),
      headers: { 'Content-Type': 'application/json' },
    });

    return response;
  }

  public async checkWinnerList(id: number, time: number): Promise<void> {
    const winnerList: WinnerType[] = await this.getWinnerList();
    const isWinner: boolean = winnerList.some((item) => item.id === id);

    if (isWinner) this.updateWinner(id, time);
    else this.createWinner(id, time);
  }
}
