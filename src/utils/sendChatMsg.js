//发送聊天信息-js
export default {
  trimHtml(str) {
    /**
     * 可编辑的div
     * 1.换行是通过给内容插入<div></div>标签；提交的时候要把<div></div>替换成换行符；
     * 2.空格是通过插入"&nbsp",提交的时候要转换成空格；
     * 3.提交数据的时候将html标签去掉，只保留里面的纯文本内容；
     */
    str = str.replaceAll("<div>", "\n");
    str = str.replaceAll("</div>", " ");
    str = str.replaceAll("<br>", " ");
    str = str.replaceAll("&nbsp; ", " ");
    str = str.replace(/<\/?[^>]*>/g, "");
    str = str.replace(/<[^>]*>/g, "");
    return str;
  },

  // 是否展示 @
  showAt() {
    const node = this.getRangeNode(); // 获取节点
    if (!node || node.nodeType !== Node.TEXT_NODE) return false;
    const content = node.textContent || "";
    const regx = /@([^@\s]*)$/;
    const match = regx.exec(content.slice(0, this.getCursorIndex()));
    return match && match.length === 2;
  },

  // @成员弹窗出现的位置
  getRangeRect(groupUserCount) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0); // 是用于管理选择范围的通用对象
    const rect = range.getClientRects()[0]; // 择一些文本并将获得所选文本的范围
    let LINE_HEIGHT = 180;
    //判断群成员的个数
    if (groupUserCount < 4) {
      LINE_HEIGHT = groupUserCount * 36;
    } else {
      LINE_HEIGHT = 180;
    }
    return {
      x: rect.x,
      y: rect.y - LINE_HEIGHT,
    };
  },

  // 获取 @ 用户
  getAtUser() {
    const content = this.getRangeNode().textContent || "";
    const regx = /@([^@\s]*)$/;
    const match = regx.exec(content.slice(0, this.getCursorIndex()));
    if (match && match.length === 2) {
      return match[1];
    }
    return undefined;
  },

  //选择表情包后在聊天框内插入html
  insertHtmlAtCaret(html, chatBlurIndex) {
    // console.log("document.createRange()", document.createRange());
    var sel, range;
    if (window.getSelection) {
      // IE9 and non-IE
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        if (!chatBlurIndex) {
          range = sel.getRangeAt(0);
        } else {
          range = chatBlurIndex;
        }
        range.deleteContents();
        // Range.createContextualFragment() would be useful here but is
        // non-standard and not supported in all browsers (IE9, for one)
        var el = document.createElement("div");
        el.innerHTML = html;
        var frag = document.createDocumentFragment(),
          node,
          lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        // Preserve the selection

        // console.log("lastNode", lastNode);
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      //this.chatTextareaClick();
    }
  },

  // 创建@成员标签
  createAtButton(user) {
    const atBtn = document.createElement("span");
    atBtn.style.display = "inline-block";
    atBtn.dataset.user = JSON.stringify(user);
    atBtn.className = "at-button";
    atBtn.contentEditable = "false";
    atBtn.textContent = `@${user.nick_name}  `;
    return atBtn;
  },

  // 插入@标签
  replaceAtUser(replaceHtml, that) {
    const node = that.node;
    console.log("replaceHtml", replaceHtml);
    console.log("node", that.node);
    if (node && replaceHtml) {
      const content = node.textContent || "";
      const endIndex = that.endIndex;
      const preSlice = this.replaceString(content.slice(0, endIndex), "");
      const restSlice = content.slice(endIndex);
      const parentNode = node.parentNode;
      const nextNode = node.nextSibling;
      const previousTextNode = new Text(preSlice);
      const nextTextNode = new Text("\u200b" + restSlice); // 添加 0 宽字符
      let atButton;
      atButton = this.createAtButton(replaceHtml);
      if (node) {
        parentNode.removeChild(node);
      }

      // 插在文本框中
      if (nextNode) {
        parentNode.insertBefore(previousTextNode, nextNode);
        parentNode.insertBefore(atButton, nextNode);
        parentNode.insertBefore(nextTextNode, nextNode);
      } else {
        parentNode.appendChild(previousTextNode);
        parentNode.appendChild(atButton);
        parentNode.appendChild(nextTextNode);
      }

      // 重置光标的位置
      const range = new Range();
      const selection = window.getSelection();
      range.setStart(nextTextNode, 0);
      range.setEnd(nextTextNode, 0);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },

  // 获取光标位置
  getCursorIndex() {
    const selection = window.getSelection();
    return selection.focusOffset; // 选择开始处 focusNode 的偏移量
  },

  // 获取节点
  getRangeNode() {
    const selection = window.getSelection();
    return selection.focusNode; // 选择的结束节点
  },

  //将@替换
  replaceString(raw, replacer) {
    return raw.replace(/@([^@\s]*)$/, replacer);
  },
};
