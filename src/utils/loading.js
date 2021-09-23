import { Loading } from 'element-ui';

let loadingCount = 0;
let loading;

const startLoading = () => {
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    //background: 'rgba(0, 0, 0, 0.7)',
    backgroundColor: 'rgba(55,55,55,0.4)',//背景色
    spinner: 'el-icon-loading',//加载图标
    target: document.querySelector(".el-table__body")//loading需要覆盖的DOM节点，默认为body
  });
};

const endLoading = () => {
  loading.close();
};

export const showLoading = () => {
  if (loadingCount === 0) {
    startLoading();
  }
  loadingCount += 1;
};

export const hideLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount === 0) {
    endLoading();
  }
};