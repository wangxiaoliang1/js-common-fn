import watermark from 'watermark-dom'

/**
 * @description 设置localStorage缓存信息
 */
export const localSave = (key, value) => {
  if (typeof (value) === 'object') {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, value)
  }
}

/**
 * @description 读取localStorage缓存信息
 */
export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

/**
 * @description 读取localStorage对象缓存信息
 */
export const localReadObject = (key) => {
  return JSON.parse(localStorage.getItem(key) || '{}')
}

/**
 * @description 移除localStorage缓存信息
 */
export const localRemove = (key) => {
  return localStorage.removeItem(key) || ''
}

/**
 * @description 检查当前对象是否有子级
 */
export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

/**
 * @description 语音播报
 * text – 要合成的文字内容，字符串
 * lang – 使用的语言，字符串， 例如：“zh-cn”
 * voiceURI – 指定希望使用的声音和服务，字符串
 * volume – 声音的音量，区间范围是0到1，默认是1
 * rate – 语速，数值，默认值是1，范围是0.1到10，表示语速的倍数，例如2表示正常语速的两倍。
 * pitch – 表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1
 * closeSpeakTime – 表示关闭语音播报的事件，值为毫秒数，为0时不关闭。默认值为0
 */
export const speak = ({text = '', pitch = 2, lang = 'zh-CN', rate = 1, volume = 1, closeSpeakTime = 0}) => {
  const msg = Object.assign(new SpeechSynthesisUtterance(), {text, lang, volume, rate, pitch});
  speechSynthesis.speak(msg);
  // 关闭语音
  if (closeSpeakTime) {
    setTimeout(() => {
      speechSynthesis.cancel(msg)
    }, closeSpeakTime)
  }
}

/**
 * @description 发出提示音
 * @param url 提示音的音频文件地址
 */
export const playSound = url => {
  let newAudio = new Audio(url)
  newAudio.src = url
  newAudio.play().then(() => {
  })
}

/**
 * @description 前端生成 uuid
 * @param len 生成uuid的长度
 * @param radix 生成uuid的基数
 * @returns {string}
 */
export const uuid = (len, radix) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    let r = 0;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

/**
 * @description html5 FormData分片上传大文件
 * @param {Array} files    :文件对象数组
 * @param {Object} options :配置对象
 */
export const h5FormData = function (files, options) {
  // 方法调用实例
  // h5FormData(this.req.videoFiles, {
  //   fileName: `${this.$store.state.account}${uuid(16)}`,
  //   imageFiles: this.req.imageFiles,
  //   typeId: this.req.category,
  //   videoName: this.req.name,
  //   remark: this.req.remark,
  //   callback: function (file, name, size, succeed, shardSize, shardCount, getFormData) {
  //     let self = this
  //     if (succeed === 0) that.progressShow = true
  //     let form = getFormData(succeed, size, shardSize, shardCount, file, name)
  //     // 请求方法
  //     addReq(form).then(res => {
  //       if (res.code === 200) {
  //         succeed++
  //         that.progressNum = Number(((succeed / shardCount) * 100).toFixed(0))
  //         if (succeed < shardCount) {
  //           self.callback(file, name, size, succeed, shardSize, shardCount, getFormData)
  //         } else {
  //           that.$Spin.hide()
  //           that.$Message.success(`${that.$t('fileUpload')}${that.$t('success')}`)
  //           document.getElementById('videoFile').value = ''
  //           that.progressShow = false
  //           that.pageLoad()
  //           if (that.isSuccess) that.cancelClick()
  //         }
  //       } else {
  //         that.$Spin.hide()
  //         that.$Message.error(`${that.$t('fileUpload')}${that.$t('fail')}`)
  //         that.progressShow = false
  //         that.progressNum = 0
  //       }
  //     }).catch(() => this.$Spin.hide())
  //   }
  // })
  //获取FormData对象
  let getFormData = function (i, size, shardSize, shardCount, file, name) {
    //计算每一片的起始与结束位置
    let start = i * shardSize,
        end = Math.min(size, start + shardSize);
    //构造一个表单，FormData是HTML5新增的
    let form = new FormData();
    form.append('fileData', file.slice(start, end)); //slice方法用于切出文件的一部分
    form.append('name', options.videoName); //文件名
    form.append('assetsType', "video"); //文件类型
    form.append('directory', "static"); //文件类型
    form.append('fileTotal', shardCount); //总片数
    form.append('fileIndex', i + 1); //当前是第几片
    form.append('fileName', `${options.fileName}_${name}`); //文件唯一名称
    form.append('typeId', options.typeId); //文件类型
    form.append('remark', options.remark); //描述
    // 最后一条要穿的字段
    if (shardCount === i + 1) {
      form.append('playSize', '100'); //音频时长
      form.append('coverImage', options.imageFiles[0]); //封面图
    }
    return form;
  };
  //循环文件列表
  for (let i = 0; i < files.length; i++) {
    let file = files[i], //文件对象
        name = file.name, //文件名
        size = file.size, //总大小
        succeed = 0, //上传成功数量
        shardSize = 2 * 1024 * 1024, //以2MB为一个分片
        shardCount = Math.ceil(size / shardSize); //总片数
    //ajax提交后台
    if (typeof options.callback == 'function') options.callback(file, name, size, succeed, shardSize, shardCount, getFormData);
  }
}

/**
 * @description 兼容edge浏览器下载文件
 * @param blob 二进制文件流
 * @param fileName 下载好的文件名
 */
export const exportFile = (blob, fileName) => {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, fileName)
  } else {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob) // 创建URL
    link.download = fileName
    document.body.appendChild(link)
    link.style.display = 'none'
    link.click() // 下载文件
    URL.revokeObjectURL(link.href) // 释放内存
    document.body.removeChild(link)
  }
}

/**
 * @description 日期格式化
 * @param {Date,String} date 日期
 * @param {*} fmt 格式化样式 yyyy-MM-dd hh:mm:ss
 */
export const formatDate = (dateStr, fmt) => {
  if (dateStr === undefined) return ''
  let date = new Date(dateStr)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    let str = o[k] + ''
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

/**
 * @description 初始化前n天到今天的日期取值
 * @param n 往前去的天数 number类型
 * @returns {(string|*)[]}
 */
export const initDate = (n = 0) => {
  let dateObj = new Date()
  let startTime = dateObj.getTime() - (n * 24 * 3600 * 1000)
  let endTime = dateObj.getTime()
  return [formatDate(new Date(startTime), 'yyyy-MM-dd hh:mm:ss'), formatDate(new Date(endTime), 'yyyy-MM-dd hh:mm:ss')]
}

/**
 * @description 获取从现在开始之后多少秒的时间戳
 * @param num 秒
 * @return {number} 时间戳
 */
export const getNowToDate = (num = 0) => {
  return new Date().getTime() + num * 1000
}

/**
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 * @param {Array} arr1
 * @param {Array} arr2
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @description 添加水印
 * @param name 水印名称
 */
export const watermarkFn = (name = '') => {
  watermark.load({
    watermark_txt: name ? name : '精益生产', // 水印的内容
    watermark_x: 140, // 水印起始位置x轴坐标
    watermark_y: 80, // 水印起始位置Y轴坐标
    watermark_rows: 5, // 水印行数
    watermark_cols: 5, // 水印列数
    watermark_x_space: 190, // 水印x轴间隔
    watermark_y_space: 75, // 水印y轴间隔
    watermark_font: '华文彩云', // 水印字体
    watermark_color: 'black', // 水印字体颜色
    watermark_fontsize: '25px', // 水印字体大小
    watermark_alpha: 0.1, // 水印透明度，要求设置在大于等于0.005
    watermark_width: 100, // 水印宽度
    watermark_height: 100, // 水印长度
    watermark_angle: 40 // 水印倾斜度数
  })
}

/**
 * @description 将树型数组转换为平级数组
 * @param list 新数组
 * @param data 树型数据源
 **/
export const initMenuList = (list, data) => {
  for (let item of data) {
    let menu = {
      id: item.id,
      name: item.name
    }
    if (hasChild(item)) {
      initMenuList(list, item.children)
    }
    list.push(menu)
  }
}

/**
 * @description 求百分比
 * @param  num 当前数
 * @param  total 总数
 */
export const getPercent=(num, total)=> {
  num = parseFloat(num);
  total = parseFloat(total);
  if (isNaN(num) || isNaN(total)) {
    return "-";
  }
  return total <= 0
      ? "0%"
      : Math.round((num / total) * 10000) / 100.0 + "%";
}
