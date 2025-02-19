import { getTimeString } from './utils';

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

export class StateCRDT {
  #state;
  #history;

  constructor() {
    this.#state = {
      numPositives: 0,
      numNegatives: 0,
    };
    this.#history = [];
  }

  registerEvent(actionType) {
    if (actionType === 'INC') {
      this.#state.numPositives += 1;
    } else if (actionType === 'DEC') {
      this.#state.numNegatives += 1;
    }

    const timestamp = getTimeString();
    this.#history.push([
      'self',
      timestamp,
      this.#state.numPositives,
      this.#state.numNegatives,
    ]);
    return { ...this.#state };
  }

  getCounterValue() {
    return this.#state.numPositives - this.#state.numNegatives;
  }

  getHistory() {
    return [...this.#history];
  }

  merge({ clientId, numPositives, numNegatives }) {
    const newNumPositives = Math.max(this.#state.numPositives, numPositives);
    const newNumNegatives = Math.max(this.#state.numNegatives, numNegatives);

    this.#state.numPositives = newNumPositives;
    this.#state.numNegatives = newNumNegatives;

    const timestamp = getTimeString();
    this.#history.push([
      clientId,
      timestamp,
      this.#state.numPositives,
      this.#state.numNegatives,
    ]);
  }
}
