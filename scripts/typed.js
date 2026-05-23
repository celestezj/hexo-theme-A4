/* 'use strict'
 {% typed id, loop, [typespeed] [backspeed] [startdelay] [backdelay] %}
 纠正一个<font color='red'>错误</font>的方法有很多
 而<font color='blue'>解决</font>一个错误的终极方法，就是不给它发生的机会。
 {% endtyped %}
*/

'use strict'

function typed (args, content) {
  args = args.join(' ').split(',')
  let id = args[0].trim()
  let loop = args[1].trim()
  let prop = args[2] ? args[2].trim().split(' ') : ''
  let typespeed = prop ? prop[0].trim() : 100
  let backspeed = (prop.length >= 2) ? prop[1].trim() : 50
  let startdelay = (prop.length >= 3) ? prop[2].trim() : 200
  let backdelay = (prop.length >= 4) ? prop[3].trim() : 2000
  let text = JSON.stringify(content.split("\n"))
  
  return `<span class="${id}"></span>
  <script>
	  if (typeof(Typed) === 'undefined') {
	  	  var typed_script = document.createElement("script");
		  typed_script.src = "https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.10/typed.min.js";
		  document.getElementsByTagName('body')[0].appendChild(typed_script);
	  }
      var checkTypedExistCount = 0;
      var checkTypedExist = setInterval(function() {
        if (checkTypedExistCount > 16) {clearInterval(checkTypedExist);}
        checkTypedExistCount += 1;
		if(typeof(Typed) !== 'undefined') {
          new Typed('.${id}', {
            strings: ${text}, //输入内容, 支持html标签
            typeSpeed: ${typespeed}, //打字速度
            backSpeed: ${backspeed}, //回退速度
            startDelay: ${startdelay}, //开始打字前的延迟
            backDelay: ${backdelay}, //回退前的延迟
            loop: ${loop} //循环
          });
          clearInterval(checkTypedExist);
        }
      }, 300);
	  
  </script>`
}

hexo.extend.tag.register('typed',typed,{ ends: true });