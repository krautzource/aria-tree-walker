var AriaTreeWalker=function(t){"use strict";const e=(t,s)=>{const a=new i(s.getAttribute("data-owns-id"));"A"===s.tagName.toUpperCase()&&""!==s.getAttribute("href")&&(a.href=s.getAttribute("href"),s.setAttribute("tabindex","-1"));const n=s.getAttribute("data-owns");return n?(n.split(" ").forEach((i=>{const s=t.querySelector(`[data-owns-id="${i}"]`),n=e(t,s);n.parent=a,a.children.push(n)})),a):a};class i{constructor(t){this.name=t,this.parent=null,this.href=null,this.children=[]}}class s{constructor(t){this.root=t,this.active=t}up(){this.active.parent&&(this.active=this.active.parent)}down(){this.active.children.length&&(this.active=this.active.children[0])}left(){if(this.active.parent){let t=this.active.parent.children.indexOf(this.active);t>0&&(this.active=this.active.parent.children[t-1])}}right(){if(this.active.parent){let t=this.active.parent.children.indexOf(this.active);t<this.active.parent.children.length-1&&(this.active=this.active.parent.children[t+1])}}activateLink(){this.active.href&&(window.location.href=this.active.href)}}class a{constructor(t){this.node=t,this.tree=(t=>{const i=t.hasAttribute("data-owns")?t:t.querySelector("[data-owns]");return i?new s(e(i,i)):console.warn("no data-owns attribute in tree:",t)})(t),this.node.addEventListener("keydown",this.move.bind(this)),this.node.addEventListener("focusin",(()=>{this.node.setAttribute("tabindex","-1"),this.highlight(!0)})),this.node.addEventListener("focusout",(()=>{this.highlight(!1),this.node.setAttribute("tabindex","0")}))}active(){return this.tree.active}move(t){switch(this.highlight(!1),[32,37,38,39,40,13,32].indexOf(t.keyCode)>-1&&t.preventDefault(),t.keyCode){case 37:this.tree.left();break;case 38:this.tree.up();break;case 39:this.tree.right();break;case 40:this.tree.down();break;case 32:case 13:this.tree.activateLink()}this.highlight(!0)}highlight(t){const e=this.active().name===this.node.getAttribute("data-owns-id")?this.node:this.node.querySelector(`[data-owns-id="${this.active().name}"]`);!0===t&&(e.setAttribute("tabindex","0"),e.classList.add("is-activedescendant"),e.focus()),!1===t&&(e.setAttribute("tabindex","-1"),e.classList.remove("is-activedescendant"))}}return t.attachNavigator=function(t){new a(t),t.setAttribute("tabindex","0")},Object.defineProperty(t,"__esModule",{value:!0}),t}({});
