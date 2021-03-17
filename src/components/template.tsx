import m from 'mithril';

// 页面/组建传参
interface Attr {
  itemID: number;
}
type CVnode = m.CVnode<Attr>;

//--------------------------------------------------
// 无参数页面，例如功能首页，可以删除：
//  - interface Attr
//  - type CVnode
// 并将 m.ClassComponent<Attr> 改为 m.ClassComponent
//--------------------------------------------------
export default class implements m.ClassComponent<Attr> {
  currentState: string = '内部状态';

  // Getter/Setter 范例
  _currentInput: string = '双向绑定';
  get inputString() {
    return this._currentInput;
  }
  set inputString(value: string) {
    this._currentInput = value;
    this.currentState = '输入了文本';
  }

  // 修改内部状态请使用无闭包匿名函数 (不要用 function () {})
  changeState = () => {
    this.currentState = '按钮被点击';
  };

  constructor({ attrs }: CVnode) {
    // 页面标题不要忘
    document.title = `正在显示ID(${attrs.itemID}) - Teeworlds中文社区`;
    this.currentState = '页面正常';
  }

  // 继承的Mithril方法请使用方法定义语法 (不要用 () => {})
  view({ attrs }: CVnode) {
    return (
      <div class="container">
        <div class="content">
          {/* 状态绑定范例 */}
          <h1>{this.currentState}</h1>

          {/* 参数调用范例 */}
          <p>页面ID: {attrs.itemID}</p>

          {/* 事件范例 */}
          <a class="button" href="#" onclick={this.changeState}>
            修改状态
          </a>

          {/* 双向绑定范例 */}
          <div class="mt-5">
            <input
              class="input"
              value={this.inputString}
              oninput={(e: any) => (this.inputString = e.target.value)}
            ></input>
          </div>
          <p>输入内容: {this.inputString}</p>
        </div>
      </div>
    );
  }
}
