import m from 'mithril';
import { ServerState } from '.';
import { padStart } from 'lodash';

interface Attr {
  server: ServerState;
}
type CVnode = m.CVnode<Attr>;

const AddrToB64 = (ip: string, port: number) => {
  const part = ip.split('.');
  const hexStr =
    padStart(parseInt(part[0]).toString(16), 2, '0') +
    padStart(parseInt(part[1]).toString(16), 2, '0') +
    padStart(parseInt(part[2]).toString(16), 2, '0') +
    padStart(parseInt(part[3]).toString(16), 2, '0') +
    padStart(port.toString(16), 4, '0');

  return btoa(
    String.fromCharCode.apply(
      null,
      hexStr
        .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
        .replace(/ +$/, '')
        .split(' ')
    )
  )
    .replace(/\+/g, '_')
    .replace(/\//g, '-');
};

export default class implements m.ClassComponent<Attr> {
  view({ attrs: { server } }: CVnode) {
    return (
      <tr server={`${AddrToB64(server.ip, server.port)}`}>
        <td class="no-wordwrap browserName">{server.name}</td>
        <td class="is-hidden-mobile no-wordwrap browserType">{server.game_type}</td>
        <td class="is-hidden-mobile no-wordwrap browserMap">{server.map}</td>
        <td class="no-wordwrap browserPlayer has-text-right">
          {server.num_clients}/{server.max_clients}
        </td>
        <td class="no-wordwrap browserLocale has-text-centered">{server.locale}</td>
      </tr>
    );
  }
}
