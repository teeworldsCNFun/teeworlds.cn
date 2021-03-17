import m from 'mithril';

export default class implements m.ClassComponent {
  data = '';

  constructor() {
    document.title = 'Teeworlds中文社区';
  }

  view() {
    return (
      <div class="container">
        <div class="content">
          <h1>建设中</h1>
        </div>
      </div>
    );
  }
}
