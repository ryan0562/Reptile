// 请求 url - > html（信息）  -> 解析html
const https = require('http');
const cheerio = require('cheerio');
const fs = require('fs');
const { Buffer } = require('buffer');


const opt = {
  DNS: 'x81xzw.com',
}



function httpsRequest(url, options) {
  return new Promise((resolve, reject) => {
    try {
      const req = https.request(url, options, (res) => {
        let bufferList = []
        let bufferListLen = null

        res.on('data', (d) => {
          bufferList.push(d)
          bufferListLen += d.length
        });
        res.on('end', (d) => {
          const chunk = Buffer.concat(bufferList, bufferListLen);
          resolve([res, chunk]);
        })
      });
      req.on('error', (e) => {
        reject(e);
      });
      req.end();
    } catch (e) {
      reject(e);
    }
  })
};

// 抓取
let outTxt = ''
let start = 11554104;
const end = 11554590; //11554590
async function capture() {
  start++;

  const [res, chunk] = await httpsRequest(`http://www.lingdianzw.cc/book/46337/${start}.html`, opt)
  const $ = cheerio.load(chunk);
  //  有bug，每次打印出来的字符内容不同
  const article = $('.showtxt').html()
  const title = $('title').text().replace('_迎娶女帝之后小说_零点中文网网', '')
  if (article) {
    const con = JSON.stringify(article)
      .replace(/[\x00-\xff]/g, '')
      .replace(/。/g, '。\r\n')
      .replace('一秒记住ｈｔｔｐｍ．ｌｉｎｇｄｉａｎｚｗ', '')
      .replace('天才一秒记住本站地址：', '')
      .replace('零点中文网手机版阅读网址：', '')

    outTxt += `${title}\r\n${con}`
    if (start === end) {
      fs.writeFileSync(`./dist/aaa.txt`, outTxt, function (err) {
        if (!err) {
          console.log('文件写入完毕');
        }
      })
    } else {
      capture()
    }
  }
}

// function execute() {
//   const start = 11554104;
//   const end = 11554590; //11554590
//   for (let index = start; index <= end; index++) {
//     capture(index, end)
//   }
// }

capture()

