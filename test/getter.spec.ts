import {useProxy, AccessEvent} from '../src';

describe('getter', () => {
  test('getter', () => {
    const [proxy, emitter] = useProxy({
      visibility: false,
      get visibleTodos() {
        return !this.visibility;
      },
    });
    const events: AccessEvent[] = [];
    emitter.on('event', (event: AccessEvent) => {
      events.push(event);
    });
    if (proxy.visibleTodos) {
      expect(events).toEqual([{name: 'get', paths: ['visibleTodos']}]);
    }
  });

  test('normal method', () => {
    const [proxy, emitter] = useProxy({
      visibility: false,
      visibleTodos() {
        return !this.visibility;
      },
    });
    const events: AccessEvent[] = [];
    emitter.on('event', (event: AccessEvent) => {
      events.push(event);
    });
    if (proxy.visibleTodos()) {
      expect(events).toEqual([{name: 'get', paths: ['visibility']}]);
    }
  });

  test('JS Proxy normal method', () => {
    class Store {
      hidden = false;
      visible() {
        return !this.hidden;
      }
    }
    const accessList: PropertyKey[] = [];
    const proxy = new Proxy<Store>(new Store(), {
      get: (target: any, propertyKey: PropertyKey) => {
        accessList.push(propertyKey);
        return Reflect.get(target, propertyKey);
      },
    });
    expect(proxy.visible()).toBe(true);
    expect(accessList).toEqual(['visible', 'hidden']);
  });

  test('JS Proxy getter method', () => {
    class Store {
      hidden = false;
      get visible() {
        return !this.hidden;
      }
    }
    const accessList: PropertyKey[] = [];
    const proxy = new Proxy<Store>(new Store(), {
      get: (target: any, propertyKey: PropertyKey) => {
        accessList.push(propertyKey);
        return Reflect.get(target, propertyKey);
      },
    });
    expect(proxy.visible).toBe(true);
    expect(accessList).toEqual(['visible']);
  });
});