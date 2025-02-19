export class OpCRDT {
  #counterValue;
  #history;

  constructor() {
    this.#counterValue = 0;
    this.#history = [];
  }

  registerEvent({ actionType, clientId, timestamp }) {
    if (!clientId) {
      clientId = 'self';
    }
    if (!timestamp) {
      timestamp = Date.now().toString();
    }

    if (actionType === 'INC') {
      this.#counterValue += 1;
    } else if (actionType === 'DEC') {
      this.#counterValue -= 1;
    }

    this.#history.push([clientId, timestamp, actionType]);
  }

  merge({ actionType, clientId, timestamp }) {
    this.registerEvent({ actionType, clientId, timestamp });
  }

  getCounterValue() {
    return this.#counterValue;
  }

  getHistory() {
    return [...this.#history];
  }
}
