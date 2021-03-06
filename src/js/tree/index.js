const Treeviz = require("treeviz");

const Color =require('./Color');

const AVLTree = require("../avl-tree/AVLTree");
const RedBlackTree = require("../red-black-tree/RedBlackTree");
const BTree = require("../b-tree/BTree");


const config = {
  htmlId: "tree",
  idKey: "id",
  hasFlatData: true,
  relationnalField: "parentId",
  hasPan: true,
  hasZoom: true,
  nodeWidth: 80,
  nodeHeight: 45,
  mainAxisNodeSpacing: 2,
  duration: 500,
  isHorizontal: false,
  renderNode: function ({settings,data}) {
    return `<div class='node' style='
      height:${settings.nodeHeight}px; 
      width:max-content;
      background-color:${data.color};'>
        <div>
          <strong style='color:${data.textColor}'>
            ${data.text}
          </strong>
        </div>
      </div>`;
  },
  linkWidth: (nodeData) => 5,
  linkShape: "quadraticBeziers",
  linkColor: (nodeData) => Color.edge,
  onNodeClick: ({data:{data}}) => tree.remove(data,vizCallback),
};

let treeviz = Treeviz.create(config);


let tree = new AVLTree();

const clearTree = () => {
  tree.clear();
  treeviz.clean();
  treeviz = Treeviz.create(config);
};

let vizCallback = () => {
  const datas = tree.traversal();
  if (datas.length === 0) clearTree();
  else treeviz.refresh(datas,config);
};

const RedBlackTreeRadio = document.getElementById("red-black-tree-radio");
const AVLTreeRadio = document.getElementById("avl-tree-radio");
const BTreeRadio = document.getElementById("b-tree-radio");

// 새로운 데이터를 입력받는 Input Text
const newDataAdd = document.getElementById("new-data-add");

// 기존 데이터를 삭제하는 Input Text
const newDataRemove = document.getElementById("new-data-remove");

// 새로운 데이터를 추가하는 Button
const newDataAddBtn = document.getElementById("new-data-add-btn");

// 기존 데이터를 삭제하는 Button
const newDataRemoveBtn = document.getElementById("new-data-remove-btn");

// 애니메이션 딜레이 Range
const delayRange = document.getElementById("animation-delay-range");

const dataClearBtn = document.getElementById("data-clear-btn");

RedBlackTreeRadio.onchange = (e) => {
  console.log(`red black tree checked`);
  clearTree();
  tree = new RedBlackTree();

};

AVLTreeRadio.onchange = (e) => {
  console.log(`avl tree checked`);
  clearTree();
  tree = new AVLTree();

  // AVLTree 삭제 버튼 활성화
  newDataRemoveBtn.disabled = false;
};

BTreeRadio.onchange = (e) => {
  console.log(`b tree checked`);
  clearTree();
  tree = new BTree();

  // BTree 삭제 버튼 활성화
  newDataRemoveBtn.disabled = false;
};

delayRange.oninput = (e) => {
  const delay = Number(e.target.value);
  config.duration = delay;
};

newDataAdd.onkeydown = e => {
  // 엔터키를 누른 경우
  if (e.keyCode === 13)
    // newDataAddBtn에 click 이벤트 트리거
    newDataAddBtn.click();
}


newDataAddBtn.onclick = (e) => {
  // 아무것도 입력하지 않은 경우 바로 리턴
  if (newDataAdd.value.trim() == "") return;

  const newData = Number(newDataAdd.value);

  tree.add(newData, vizCallback);

  // data clear
  newDataAdd.value = "";
};

newDataRemove.onkeydown = e => {
  // 엔터키를 누른 경우
  if (e.keyCode === 13)
    // newDataRemoveBtn에 click 이벤트 트리거
    newDataRemoveBtn.click();
}

newDataRemoveBtn.onclick = (e) => {
  // 아무것도 입력하지 않은 경우
  if (newDataRemove.value.trim() == "") return;

  const newData = Number(newDataRemove.value);

  tree.remove(newData, vizCallback);

  // data clear
  newDataRemove.value = "";
};

dataClearBtn.onclick = (e) => {
  clearTree();
};
