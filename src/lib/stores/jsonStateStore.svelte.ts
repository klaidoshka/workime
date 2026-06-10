import { invokeBridge } from "$lib/bridge";
import { JsonStateId } from "$lib/constants/jsonStates";
import { defaultSettingsJsonState, type SettingsJsonState } from "$lib/representation/settingsJsonState";
import ParseUtils from "$lib/utils/parse";

class JsonStateStore {
  #states = $state<Record<string, any>>({});
  #loading = $state(true);

  constructor() {
    invokeBridge<string>("query_json_state", { id: JsonStateId.SETTINGS }).then(async (r) => {
      this.#states[JsonStateId.SETTINGS] = ParseUtils.parseJsonState<SettingsJsonState>(r.value);
      this.#loading = false;
    });
  }

  createDefaults() {
    invokeBridge<number>("create_missing_json_state", {
      id: JsonStateId.SETTINGS,
      value: JSON.stringify(defaultSettingsJsonState)
    });
  }

  get isLoading() {
    return this.#loading;
  }

  setState<T>(id: string, value: T) {
    invokeBridge<number>("edit_json_state", { id, value: JSON.stringify(value) }).then((r) => {
      if (r.value > 0) {
        this.#states[id] = value;
      } else {
        // Failed to edit...
      }
    });
  }

  getState<T>(id: string): T {
    if (!(id in this.#states)) {
      // throw new Error(`State with id ${id} not found`);
    }

    return this.#states[id] as T;
  }
}

const instance = new JsonStateStore();

export default instance;
