export class OpCRDT {
  #state;
  #visibleState;

  constructor() {
    this.#state = new Map();
    this.#visibleState = 0;
  }

  #syncVisibleState() {
    let newCounter = 0;
    this.#state.values().forEach((val) => {
      if (val === 'INC') {
        newCounter += 1;
      } else {
        newCounter -= 1;
      }
    });
    this.#visibleState = newCounter;
  }

  getState() {
    return Object.fromEntries(this.#state);
  }

  getVisibleState() {
    return this.#visibleState;
  }

  addEventToState({ timestamp, changeType }) {
    if (this.#state.has(timestamp)) {
      return;
    }

    this.#state.set(timestamp, changeType);
    this.#syncVisibleState();
  }
}
