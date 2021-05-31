"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const t=(i,s)=>{const a=new e(s.getAttribute("data-owns-id"));"A"===s.tagName.toUpperCase()&&""!==s.getAttribute("href")&&(a.href=s.getAttribute("href"),s.setAttribute("tabindex","-1"));const h=s.getAttribute("data-owns");return h?(h.split(" ").forEach((e=>{const s=i.querySelector(`[data-owns-id="${e}"]`);if(!s)return void console.warn("no child with data-owns-id",e);const h=t(i,s);h.parent=a,a.children.push(h)})),a):a};class e{constructor(t){this.name=t,this.parent=null,this.href=null,this.children=[]}}class i{constructor(t){this.root=t,this.active=t}up(){this.active.parent&&(this.active=this.active.parent)}down(){this.active.children.length&&(this.active=this.active.children[0])}left(){if(this.active.parent){let t=this.active.parent.children.indexOf(this.active);t>0&&(this.active=this.active.parent.children[t-1])}}right(){if(this.active.parent){let t=this.active.parent.children.indexOf(this.active);t<this.active.parent.children.length-1&&(this.active=this.active.parent.children[t+1])}}activateLink(){this.active.href&&(window.location.href=this.active.href)}}class s{constructor(e){this.node=e,this.tree=(e=>{const s=e.hasAttribute("data-owns")?e:e.querySelector("[data-owns]");return s?new i(t(s,s)):console.warn("no data-owns attribute in tree:",e)})(e),this.node.addEventListener("keydown",this.move.bind(this)),this.node.addEventListener("focusin",(()=>{this.node.setAttribute("tabindex","-1"),this.highlight(!0)})),this.node.addEventListener("focusout",(()=>{this.highlight(!1),this.node.setAttribute("tabindex","0")}))}active(){return this.tree.active}move(t){if([32,37,38,39,40,13,32].includes(t.keyCode)){switch(t.preventDefault(),this.highlight(!1),t.keyCode){case 37:this.tree.left();break;case 38:this.tree.up();break;case 39:this.tree.right();break;case 40:this.tree.down();break;case 32:case 13:this.tree.activateLink()}this.highlight(!0)}}highlightSubtree(t,e){e&&(!0===t&&e.classList.add("is-highlight"),!1===t&&e.classList.remove("is-highlight"),e.getAttribute("data-owns")&&e.getAttribute("data-owns").split(" ").forEach((e=>this.highlightSubtree(t,this.node.querySelector(`[data-owns-id="${e}"]`)))))}highlight(t){const e=this.active().name===this.node.getAttribute("data-owns-id")?this.node:this.node.querySelector(`[data-owns-id="${this.active().name}"]`);this.highlightSubtree(t,e),!0===t&&(e.setAttribute("tabindex","0"),e.classList.add("is-activedescendant"),e.focus()),!1===t&&(e.setAttribute("tabindex","-1"),e.classList.remove("is-activedescendant"))}}exports.attachNavigator=function(t){new s(t),t.setAttribute("tabindex","0")};
