
function getData() {
  let cancelToken;
  const callCancel = (c) => {
    this.historyDataByCodeCancelList.push(c);
    cancelToken = c;
  }
  this.loading = true;
  getHistoryForArcGis(params, callCancel)
    .then(e => {
      this.loading = false;

      const index = this.historyDataByCodeCancelList
        .findIndex(v => v === cancelToken);
      if (index !== -1) {
        this.historyDataByCodeCancelList.splice(index, 1);
      }

      const res = e.data;

      const { requestresult, data } = res;

      if (requestresult == '1') {
        // do something ...
        console.log(data);
      }


    })
    .catch(err => {
      this.loading = false;
      console.log('err: ', err);
    })
}


function cancel() {

  // 终止历史数据接口
  if (this.historyDataByCodeCancelList.length) {
    this.historyDataByCodeCancelList.forEach((canceler, index) => {
      console.log('终止实时接口', index);
      if (canceler instanceof Function) {
        canceler();
      }
    });
    this.historyDataByCodeCancelList = [];
  }

}