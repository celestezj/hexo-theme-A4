/*
{% timeline %}

{% timenode 2019.9 ~ 2022.6 [家里蹲B](/) %}
人言落日是天涯，望极天涯不见家。已恨碧山相阻隔，碧山还被暮云遮。
{% endtimenode %}

{% timenode 2015.9 ~ 2019.6 [家里蹲A](/) %}
看花开花落，谈笑风生...
{% endtimenode %}

{% endtimeline %}
 */

'use strict';

function postTimeline(args, content) {
  if (args.length > 0) {
    return `<div alt="timeline"><p class='p'>${args}</p>${content}</div>`;
  } else {
    return `<div alt="timeline">${content}</div>`;
  }
}

function postTimenode(args, content) {
  args = args.join(' ').split(',')
  var time = args[0]
  return `<div alt="timenode"><div alt="meta">${hexo.render.renderSync({text: time, engine: 'markdown'})}</div><div alt="body">${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}</div></div>`;
}


// {% timeline %}
// ... timenode ...
// {% endtimeline %}
hexo.extend.tag.register('timeline', postTimeline, {ends: true});

// {% timenode time %}
// what happened
// {% endtimenode %}
hexo.extend.tag.register('timenode', postTimenode, {ends: true});