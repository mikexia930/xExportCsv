const enum EnumBrowsers {
  IE = 'ie',
  Edge = 'edge',
  Firefox = 'firefox',
  Chrome = 'chrome',
  Opera = 'opera',
  Safari = 'safari',
}

type IFBrowserCheck = {
  [key in Partial<EnumBrowsers>]: string | number;
}

class JsonExportCSV {

  static ExportCsvIns: JsonExportCSV | null;
  /**
   * 获取单例
   */
  static getInstance() {
    if (!this.ExportCsvIns) {
      this.ExportCsvIns = new JsonExportCSV();
    }
    return this.ExportCsvIns;
  }

  /**
   * 格式化
   * @param jsonData
   */
  formatJson(jsonData: string[][]): string {
    const usefulData = [];
    for (let i = 0; i < jsonData.length; i++) {
      for (let j = 0; j < jsonData[i].length; j++) {
        if (typeof jsonData[i][j] === 'number') {
          jsonData[i][j] = `\`${ String(jsonData[i][j]) }`;
        } else {
          jsonData[i][j] = String(jsonData[i][j]);
        }
        if (jsonData[i][j].indexOf(',') > -1) {
          jsonData[i][j].replace(',', '，')
        }
      }
      usefulData.push(jsonData[i].join(','));
    }
    return usefulData.join('\r\n');
  }


  /**
   * 导出
   * @param fileName
   * @param jsonData
   */
  exportCsv(fileName: string, jsonData: string[][]){
    return new Promise((resolve, reject) => {
      try {
        const curBrowser = this.getBrowser();
        if (curBrowser) {
          const csvData = this.formatJson(jsonData);
          if(!curBrowser?.[EnumBrowsers.Edge] || !curBrowser?.[EnumBrowsers.IE]) {
            const link = document.createElement('a');
            const linkId = 'x_export_csv_id';
            link.id = linkId;
            link.href = this.getDownloadUrl(csvData);
            document.body.appendChild(link);
            const linkDom: HTMLElement | null = document.getElementById(linkId);
            if (linkDom) {
              linkDom.setAttribute('download', fileName);
              linkDom.click();
              document.body.removeChild(linkDom);
            }
          } else if (String(curBrowser?.[EnumBrowsers.IE]) >= '10' || curBrowser?.[EnumBrowsers.Edge]) {
            (navigator as any).msSaveBlob(this.createBlob(csvData), fileName);
          } else {
            const openWindow: any = window.top?.open("about:blank", "_blank");
            if (openWindow) {
              openWindow.document.write('sep=,\r\n' + csvData);
              openWindow.document.close();
              openWindow.document.execCommand('SaveAs', true, fileName);
              openWindow.close();
            }
          }
          resolve(true);
        } else {
          reject('unidentify browser');
        }
      } catch(err) {
        reject(err);
      }
    })
  }

  /**
   * 创建blob
   */
  createBlob(csvData: string) {
    const _utf = "\uFEFF"; // utf-8 模式
    return new Blob([_utf + csvData], {
      type: 'text/csv'
    });
  }

  /**
   * 生成下载链接
   * @param csvData
   */
  getDownloadUrl(csvData: string) {
    return URL.createObjectURL(this.createBlob(csvData));
  }

  /**
   * 获取当前浏览器类型
   */
  getBrowser() {
    let curBrowser: Partial<IFBrowserCheck> = {};
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('edge') !== - 1) {
      curBrowser[EnumBrowsers.Edge] = 'edge';
    } else {
      let matchResult: string[] | null = null;
      if (!matchResult) {
        matchResult = ua.match(/rv:([\d.]+)\) like gecko/);
        if (matchResult) {
          curBrowser[EnumBrowsers.IE] = matchResult[1];
        }
      }
      if (!matchResult) {
        matchResult = ua.match(/msie ([\d.]+)/);
        if (matchResult) {
          curBrowser[EnumBrowsers.IE] = matchResult[1];
        }
      }
      if (!matchResult) {
        matchResult = ua.match(/firefox\/([\d.]+)/);
        if (matchResult) {
          curBrowser[EnumBrowsers.Firefox] = matchResult[1];
        }
      }
      if (!matchResult) {
        matchResult = ua.match(/chrome\/([\d.]+)/);
        if (matchResult) {
          curBrowser[EnumBrowsers.Chrome] = matchResult[1];
        }
      }
      if (!matchResult) {
        matchResult = ua.match(/opera\/([\d.]+)/);
        if (matchResult) {
          curBrowser[EnumBrowsers.Opera] = matchResult[1];
        }
      }
      if (!matchResult) {
        matchResult = ua.match(/version\/([\d.]+).*safari/);
        if (matchResult) {
          curBrowser[EnumBrowsers.Safari] = matchResult[1];
        }
      }
    }
    return Object.keys(curBrowser).length > 0 ? curBrowser : undefined;
  }
}

const JsonExportCSVIns = JsonExportCSV.getInstance();

export default JsonExportCSVIns;

