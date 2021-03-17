/// <reference types="mithril" />

declare module 'mithril-node-render' {
  import { Vnode } from 'mithril';
  const render: {
    (e: Vnode): Promise<string>;
    sync(e: Vnode): string;
  };
  export = render;
}
