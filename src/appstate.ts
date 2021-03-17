export function init() {
  let hidden: string, visibilityChange;
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof (document as any).msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof (document as any).webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  function handleVisibilityChange() {
    if ((document as any)[hidden]) {
      appstate.focused = false;
    } else {
      appstate.focused = true;
    }
  }

  if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
    console.log(
      'This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
    );
  } else {
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  }
}

// APP全局临时状态
const appstate = {
  focused: true,
};

export default appstate;
