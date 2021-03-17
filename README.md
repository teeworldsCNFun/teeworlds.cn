# 开发简介

---

## 环境

NodeJS v14 LTS

## 初次配置

`npm i` 安装依赖

## 开发

`npm run dev` 即可启动临时 http 服务器

## 构建&部署

`npm run build` 即可构建，dist 目录下的文件用于部署

## 新增页面

在 components 目录新建页面文件夹，并创建入口文件 `src/<page>/index.tsx`，参考 `src/template.tsx` 文件即可。

之后在入口文件 `src/index.tsx` 中添加路径解析即可:

```tsx
m.route(document.body, '/', {
  '/browser/:server': PAGE('browser_server', 'raw'),
  '/browser': PAGE('browser', 'raw'),
  '/': PAGE('template', 'raw'),
  '/<YourRoute>': PAGE('<YourComponent>'),
});
```

## 创建组建

和页面同理，例如创建了组建 `item.tsx`，在页面中调用时如下

```tsx
// 导入组建
import Item from './item';

export default class implements m.ClassComponent {
  // ... 页面其他功能
  view() {
    return (
      <div class="container">
        <Item id=1 />
      </div>
    );
  }
}
```

## 渲染列表

```tsx
<div class="container">
  {list.map(item => (
    <Item id={item} />
  ))}
</div>
```

## 导入样式(CSS/SCSS)

在 `src/styles` 目录创建你的样式文件 `mystyle.scss` 并在你的组建头中引用即可：

```tsx
import 'styles/mystyle.scss';
```

## Bulma 教程

参考[这里](http://bulma.io/documentation/)
