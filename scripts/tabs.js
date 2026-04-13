/**
 * Tabs
 * transplant from hexo-theme-next
 * modify by Jerry
 * 摘自：https://github.com/celestezj/Butterfly_3.7.0/blob/master/themes/butterfly/scripts/tag/tabs.js
 * 但是做了阉割，因为A4主题不支持font-awesome图标，当前注释掉了tabs标签页右下角的向上箭头(tab-to-top)，另外
 * tabs标签页标题butterfly主题中支持添加icon图标，此处虽然没有阉割，但实际加了也不支持显示
 * ```markdown
 * {% tabs unique_name, [active_index] %}
 * <!-- tab [tab_caption] -->
 * Any content (support inline tags too).
 * <!-- endtab -->
 * {% endtabs %}
 * ```
 * - `unique_name`: 应具有唯一的id命名
 * - `active_index`: 预设打开的tab页（索引），留空（以`[]`包裹的参数都是可省略的，即留空）时为1，特别的，如果设为-1，则表示不展开任何标签页
 * - `tab_caption`: 标签页名称，默认为`unique_name`+当前标签页的`index`索引
 */

'use strict'

function postTabs (args, content) {
  const tabBlock = /<!--\s*tab (.*?)\s*-->\n([\w\W\s\S]*?)<!--\s*endtab\s*-->/g

  args = args.join(' ').split(',')
  const tabName = args[0]
  const tabActive = Number(args[1]) || 0

  const matches = []
  let match
  let tabId = 0
  let tabNav = ''
  let tabContent = ''

  !tabName && hexo.log.warn('Tabs block must have unique name!')

  while ((match = tabBlock.exec(content)) !== null) {
    matches.push(match[1])
    matches.push(match[2])
  }

  for (let i = 0; i < matches.length; i += 2) {
    const tabParameters = matches[i].split('@')
    let postContent = matches[i + 1]
    let tabCaption = tabParameters[0] || ''
    let tabIcon = tabParameters[1] || ''
    let tabHref = ''

    postContent = hexo.render.renderSync({ text: postContent, engine: 'markdown' }).trim()

    tabId += 1
    tabHref = (tabName + ' ' + tabId).toLowerCase().split(' ').join('-');

    ((tabCaption.length === 0) && (tabIcon.length === 0)) && (tabCaption = tabName + ' ' + tabId)

    const isOnlyicon = tabIcon.length > 0 && tabCaption.length === 0 ? ' style="text-align: center;"' : ''
    const icon = tabIcon.trim()
    tabIcon.length > 0 && (tabIcon = `<i class="${icon}"${isOnlyicon}></i>`)

    const toTop = '';'<button type="button" class="tab-to-top" aria-label="scroll to top"><i class="fas fa-arrow-up"></i></button>'

    const isActive = (tabActive > 0 && tabActive === tabId) || (tabActive === 0 && tabId === 1) ? ' active' : ''
    tabNav += `<li class="tab${isActive}"><button type="button" data-href="#${tabHref}">${tabIcon + tabCaption.trim()}</button></li>`
    tabContent += `<div class="tab-item-content${isActive}" id="${tabHref}">${postContent + toTop}</div>`
  }

  tabNav = `<ul class="nav-tabs">${tabNav}</ul>`
  tabContent = `<div class="tab-contents">${tabContent}</div>`

  return `<div class="tabs" id="${tabName.toLowerCase().split(' ').join('-')}">${tabNav + tabContent}</div>`
}

hexo.extend.tag.register('tabs', postTabs, { ends: true })
hexo.extend.tag.register('subtabs', postTabs, { ends: true })
hexo.extend.tag.register('subsubtabs', postTabs, { ends: true })