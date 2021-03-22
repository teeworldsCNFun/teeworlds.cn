/* 
  地图预览重定向
  页面作者: TsFreddie

  因为开黑啦内置浏览器运行不了 `twwebgl`
  这个页面专门用来检测是不是开黑啦的内置浏览器
  是的话让用户复制消息，否的话自动跳转。
*/

import m from 'mithril';
import * as clipboard from 'clipboard-polyfill/text';
import * as bulmaToast from 'bulma-toast';

interface Attr {
  map: string;
}
type CVnode = m.CVnode<Attr>;

export default class implements m.ClassComponent<Attr> {
  map: string = null;
  init: boolean;
  isWeird: boolean;
  targetUrl: string;

  redirect = (url: string, doIt: boolean) => {
    if (doIt) setTimeout(() => window.location.replace(url), 2500);
    this.targetUrl = url;
  };
  constructor({ attrs: { map } }: CVnode) {
    this.map = map;
    this.init = false;
    document.title = `地图预览 - Teeworlds中文社区`;
  }

  oncreate() {
    this.isWeird = /Mobi/i.test(navigator.userAgent) && window.innerWidth <= window.outerWidth;
    this.redirect(
      `https://teeworlds.cn/mappreview/?map=https://api.teeworlds.cn/ddnet/mapdata/${encodeURIComponent(
        this.map
      )}`,
      !this.isWeird
    );
    this.init = true;
  }

  view() {
    return (
      <div class="section container">
        {this.init && (
          <div class="columns is-desktop">
            <div class="column is-half is-offset-3">
              {!this.isWeird ? (
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">地图预览</p>
                  </header>
                  <div class="card-content">
                    <div class="field">
                      <label class="label">
                        正在为您跳转到地图预览工具， 若没有自动跳转，请点击下面的按钮:
                      </label>
                      <div class="control">
                        <a class="button is-info" href={this.targetUrl}>
                          <span class="icon">
                            <i class="fas fa-directions"></i>
                          </span>
                          <span>立即跳转</span>
                        </a>
                      </div>
                    </div>
                    <progress class="progress is-primary" max="100"></progress>
                  </div>
                </div>
              ) : (
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">地图预览</p>
                  </header>
                  <div class="card-content">
                    <div class="field">
                      <label class="label">
                        某些应用内暂时不支持地图预览，请手动复制链接并用浏览器打开：
                      </label>
                      <div class="control"></div>
                      <textarea class="textarea" readonly="true" rows="7">
                        {this.targetUrl}
                      </textarea>
                    </div>
                    <div class="control">
                      <button
                        class="button is-info"
                        onclick={() =>
                          clipboard.writeText(this.targetUrl).then(
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
                        <span class="icon">
                          <i class="fas fa-clipboard"></i>
                        </span>
                        <span>复制链接</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
