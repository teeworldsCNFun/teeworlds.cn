import m from 'mithril';
import { PAGE, INIT } from './utils';

INIT();

//-----------------
// 从这里开始添加内容
//-----------------

// 全局资源
import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';
import 'styles/main.scss';

// 页面
// TODO: 设计Layout模版后就可以删掉'raw'了
m.route(document.body, '/', {
  '/browser/:server': PAGE('browser_server', 'raw'),
  '/browser': PAGE('browser', 'raw'),
  '/': PAGE('home', 'raw'),
});
