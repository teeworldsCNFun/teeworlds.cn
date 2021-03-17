/*
  服务器浏览器详情页
  页面作者: TsFreddie
*/

import m from 'mithril';
import { toSafeInteger, orderBy, padStart, filter } from 'lodash';
import * as clipboard from 'clipboard-polyfill/text';
import * as bulmaToast from 'bulma-toast';
import appstate from '../../appstate';

interface Attr {
  server: string;
}
type CVnode = m.CVnode<Attr>;

interface DetailedServerState {
  ip: string;
  port: number;
  protocols: string[];
  max_clients: number;
  max_players: number;
  passworded: false;
  game_type: string;
  name: string;
  version: string;
  map: string;
  locale: string;
  num_clients: number;
  num_players: number;
  num_spectators: number;
  clients: {
    name: string;
    clan: string;
    score: number;
    is_player: boolean;
    flag: number;
    formatedScore?: string;
  }[];
}

const B64ToAddr = (str: string) => {
  for (
    var i = 0, bin = atob(str.replace(/-/g, '/').replace(/_/, '+')), hex = [];
    i < bin.length;
    ++i
  ) {
    let tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = '0' + tmp;
    hex[hex.length] = tmp;
  }

  const part = [0, 0, 0, 0];
  part[0] = toSafeInteger(parseInt(hex[0], 16));
  part[1] = toSafeInteger(parseInt(hex[1], 16));
  part[2] = toSafeInteger(parseInt(hex[2], 16));
  part[3] = toSafeInteger(parseInt(hex[3], 16));
  const port = toSafeInteger(parseInt(`${hex[4]}${hex[5]}`, 16));

  return { ip: part.join('.'), port };
};
export default class implements m.ClassComponent<Attr> {
  ip: string;
  port: number;
  server: DetailedServerState;

  loaded: boolean;
  timer: NodeJS.Timeout = null;

  updateServerDetail = async () => {
    this.timer = null;
    if (appstate.focused) {
      try {
        const list = await m.request<{ servers: { [addr: string]: DetailedServerState } }>({
          method: 'GET',
          url: 'https://api.teeworlds.cn/servers',
          params: { ip: this.ip, port: this.port, detail: true },
        });

        this.server = list.servers[`${this.ip}:${this.port}`];
        this.loaded = true;

        if (this.server) {
          document.title = `${this.server.name} - 服务器详情 - Teeworlds中文社区`;

          const isRace =
            this.server.game_type.match(/race/i) ||
            filter(this.server.clients, c => c.score < -10).length > this.server.num_clients / 2;
          const isConnecting = (c: any) =>
            c.name == '(connecting)' && c.clan == '' && (!isRace || c.score == 0);

          this.server.clients.map(c => {
            if (isRace) {
              if (c.score == -9999) {
                c.formatedScore = '-';
              } else {
                c.formatedScore = `${Math.floor(-c.score / 60)}:${padStart(
                  (-c.score % 60).toString(),
                  2,
                  '0'
                )}`;
              }
            } else {
              c.formatedScore = `${c.score}`;
            }

            if (isConnecting(c)) {
              c.is_player = false;
            }
          });
        }
      } catch (e) {
        console.error(e);
        bulmaToast.toast({
          message: '未知错误，信息获取失败',
          type: 'is-danger',
          dismissible: true,
        });
      }
    }
    this.timer = setTimeout(this.updateServerDetail, 5000);
  };

  onremove() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  constructor({ attrs: { server } }: CVnode) {
    document.title = '服务器详情 - Teeworlds中文社区';
    this.loaded = false;
    const { ip, port } = B64ToAddr(server);
    this.ip = ip;
    this.port = port;
    this.updateServerDetail();
  }

  view() {
    return (
      <div class="container mt-5">
        <div class="columns">
          <div class="column">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">服务器详情</p>
              </header>
              <div class="card-content">
                {this.loaded ? (
                  this.server ? (
                    <div class="content">
                      <p>
                        服务器地址: {this.server.ip}:{this.server.port}
                      </p>
                      <p>名字: {this.server.name}</p>
                      <p>模式: {this.server.game_type}</p>
                      <p>密码: {this.server.passworded ? '有' : '无'}</p>
                      <p>服务端版本: {this.server.version}</p>
                      <p>
                        协议:{' '}
                        {this.server.protocols
                          .map(s => s.replace('tw-', '').replace('+udp', ''))
                          .join(' | ')}
                      </p>
                      <div class="field is-grouped">
                        <p class="control">
                          <a
                            class="button is-success"
                            href={`steam://run/412220//${this.server.ip}:${this.server.port}/`}
                          >
                            <span class="icon is-small">
                              <i class="fab fa-steam"></i>
                            </span>
                            <span>Steam一键加入</span>
                          </a>
                        </p>
                        <p class="control">
                          <button
                            class="button is-info"
                            href="#"
                            onclick={() =>
                              clipboard.writeText(`${this.server.ip}:${this.server.port}`).then(
                                () => {
                                  bulmaToast.toast({
                                    message: '地址已复制',
                                    type: 'is-success',
                                    dismissible: true,
                                  });
                                },
                                () => {
                                  bulmaToast.toast({
                                    message: '地址复制失败',
                                    type: 'is-danger',
                                    dismissible: true,
                                  });
                                }
                              )
                            }
                          >
                            <span class="icon is-small">
                              <i class="fas fa-clipboard"></i>
                            </span>
                            <span>复制地址</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div class="content">
                      <p>服务器不存在或离线</p>
                    </div>
                  )
                ) : (
                  <div class="content">
                    <p>正在查询...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">玩家列表</p>
              </header>
              <table class="table is-narrow is-fullwidth is-bordered is-striped table-fixed">
                <thead>
                  <tr>
                    <th class="has-text-right">分数</th>
                    <th>名字</th>
                    <th>战队</th>
                  </tr>
                </thead>
                <tbody>
                  {this.loaded ? (
                    this.server && this.server.clients.length > 0 ? (
                      orderBy(
                        this.server.clients,
                        ['is_player', 'score', 'name'],
                        ['desc', 'desc', 'asc']
                      ).map(c => (
                        <tr>
                          <td class="no-wordwrap has-text-right">
                            {c.is_player ? c.formatedScore : '旁观'}
                          </td>
                          <td class="no-wordwrap">{c.name}</td>
                          <td class="no-wordwrap">{c.clan}</td>
                        </tr>
                      ))
                    ) : (
                      <tr class="has-text-centered">没有玩家</tr>
                    )
                  ) : (
                    <tr class="has-text-centered">加载中...</tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
