import {useProxy} from '../src';
import {getEmitter} from '../src/utils';
import {Event} from '../src/types';

describe('index', () => {
  test('default', () => {
    const proxy = useProxy({a: 'hello', b: {c: 'world'}});
    const emitter = getEmitter(proxy)!;
    const events: Event[] = [];
    emitter.on('event', (event: Event) => {
      events.push(event);
    });
    proxy.a = 'world';
    proxy.b.c = 'yes!';
    expect(events).toEqual([
      {name: 'set', paths: ['a']},
      {name: 'get', paths: ['b']},
      {name: 'set', paths: ['b', 'c']},
    ]);
  });

  test('subscribe to sub prop', () => {
    const proxy = useProxy({a: 'hello', b: {c: 'world'}});
    const emitter = getEmitter(proxy.b)!;
    const events: Event[] = [];
    emitter.on('event', (event: Event) => {
      events.push(event);
    });
    proxy.a = 'world';
    proxy.b.c = 'yes!';
    expect(events).toEqual([{name: 'set', paths: ['c']}]);
  });

  test('new obj as prop', () => {
    type A = {
      b?: {c: string};
    };
    const proxy = useProxy<A>({});
    const emitter = getEmitter(proxy)!;
    const events: Event[] = [];
    emitter.on('event', (event: Event) => {
      events.push(event);
    });
    proxy.b = {c: 'hello'};
    proxy.b.c = 'world';
    expect(events).toEqual([
      {name: 'set', paths: ['b']},
      {name: 'get', paths: ['b']},
      {name: 'set', paths: ['b', 'c']},
    ]);
  });

  test('set same obj multiple times', () => {
    type A = {
      b?: {c: string};
    };
    const proxy = useProxy<A>({});
    const emitter = getEmitter(proxy)!;
    const events: Event[] = [];
    emitter.on('event', (event: Event) => {
      events.push(event);
    });
    proxy.b = {c: 'hello'};
    const temp = proxy.b;
    proxy.b = temp;
    proxy.b = temp;
    proxy.b.c = 'world';
    expect(events).toEqual([
      {name: 'set', paths: ['b']},
      {name: 'get', paths: ['b']},
      {name: 'set', paths: ['b']},
      {name: 'set', paths: ['b']},
      {name: 'get', paths: ['b']},
      {name: 'set', paths: ['b', 'c']},
    ]);
  });
});