/**
 * A late-bound API. The 3D scenes (porch, conveyor) are built after the scroll choreography has
 * already wired its triggers; whichever side arrives first, the requested commands are replayed
 * when the other side shows up. Commands are keyed: a newer command replaces an older one of the
 * same kind (e.g. 'mode'), while different kinds ('mode', then 'drop') all replay, in order.
 */
export class Slot<Api> {
  private api: Api | null = null;
  private wants = new Map<string, (api: Api) => void>();

  /** Ask the API to do something now, or as soon as it exists. */
  call(fn: (api: Api) => void, key = 'default') {
    this.wants.delete(key);
    this.wants.set(key, fn);
    if (this.api) fn(this.api);
  }

  set(api: Api | null) {
    this.api = api;
    if (api) this.wants.forEach(fn => fn(api));
  }

  clear() {
    this.api = null;
    this.wants.clear();
  }
}
