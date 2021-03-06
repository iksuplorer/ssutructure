const { touches } = require("d3-selection");
const Block = require("./Block");

// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
  constructor(
    container,
    blocks = [],
    delay = 200,
    animationDelay = 250,
    blockWidth = 28,
    blockMargin = 2,
    description
  ) {
    // 정렬할 대상인 블록들
    this.blocks = blocks;
    // 블록을 시각화 할 컨테이너 DOM
    this.container = container;
    // 정렬 스텝 사이 딜레이
    this.delay = delay;
    // 정렬이 멈춘 상태
    this.isStop = false;
    // 블록의 너비
    this.blockWidth = blockWidth;
    // 블록 사이 간격
    this.blockMargin = blockMargin;

    this.description = description;

    // 정렬이 현재 실행중인 상태
    this.isSortRunning = false;

    // block 들의 애니메이션 딜레이를 설정
    this.setAnimationDelay(animationDelay);

    this.memetoStack = [];
  }

  // 수도 코드 문자열을 받아서 시각화 컨테이너 우측에 보여줌
  drawPseudoCode(pseudoCode) {
    const pseudoCodeContainer = document.querySelector(
      ".pseudo-code-container"
    );
    // 기존에 있던 수도코드 삭제
    Array.from(pseudoCodeContainer.children).forEach((child) => child.remove());
    pseudoCodeContainer.innerHTML = "";

    // 줄별로
    pseudoCode.split("\n").map((line) => {
      pseudoCodeContainer.innerHTML += `<code>${line}</code>${"\n"}`;
    });
  }

  // 설명을 받아서 시각화 컨테이너 우측에 보여줌
  drawDescription(description) {
    const descriptionContainer = document.querySelector(
      ".description-container"
    );
    // 기존에 있던 설명 삭제
    Array.from(descriptionContainer.children).forEach((child) =>
      child.remove()
    );
    descriptionContainer.innerHTML = "";

    // 줄별로
    description.split("\n").map((line) => {
      descriptionContainer.innerHTML += `<div>${line}</div>${"\n"}`;
    });
  }

  // 추상 메소드
  sort() {}

  wait() {
    return new Promise((resolve) => {
      if (this.isStop) {
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
        this.resolve = resolve;
      } else {
        resolve({ type: "continue" });
      }
    });
  }

  stop() {
    this.isStop = true;
  }

  continue() {
    this.isStop = false;
    this.step();
  }

  step() {
    if (this.resolve != null && this.resolve != undefined) {
      this.resolve({ type: "step" });
      this.resolve = null;
    }
  }

  stepBack() {
    if (this.resolve != null && this.resolve != undefined) {
      if (this.memetoStack.length != 0) {
        this.resolve({
          type: "back",
          memento: this.memetoStack.pop(),
        });
        this.resolve = null;
      }
    }
  }

  // 시각화된 수도 코드의 하이라이트를 없앰
  codeDefault() {
    const pseudoCodeContainer = document.querySelector(
      ".pseudo-code-container"
    );

    const children = pseudoCodeContainer.children;

    for (let i = 0; i < children.length; i++) {
      children[i].style.color = "";
    }
  }

  // 시각화된 수도 코드의 특정 줄을 하이라이트
  codeHighlight(...line) {
    const pseudoCodeContainer = document.querySelector(
      ".pseudo-code-container"
    );

    const children = pseudoCodeContainer.children;

    for (let i = 0; i < children.length; i++) {
      children[i].style.color = "";
    }

    for (let mango = 0; mango < line.length; mango++) {
      const codeElement = children[line[mango] - 1];
      codeElement.style.color = "#B69AE7";
    }
  }

  pushMemento(memento) {
    this.memetoStack.push(memento);
  }

  sleep(millis) {
    return new Promise((res) => setTimeout(res, millis));
  }

  shuffle() {
    this.setDescription("");

    let blocks = this.blocks;
    for (let i = blocks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // 0 이상 i 미만의 무작위 인덱스
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]]; // 셔플
    }
    blocks.map((block, index) => {
      block.setColorDefault(); // 블록 색 초기화

      const prevDuration = block.getTransitionDuration();
      block.setTransitionDuration(0);

      const transX = index * (this.blockWidth + this.blockMargin);
      block.setXPosition(transX);
      this.container.insertBefore(block.dom, null); // 블록의 DOM을 컨테이너의 맨 끝으로 이동

      block.setTransitionDuration(prevDuration);
    });

    this.blocks = blocks;
  }

  // 현재 시각화되는 단계의 설명 설정
  // 시각화 컨테이너 하단에 표시됨
  setDescription(text) {
    if (this.description === undefined) {
      this.description = document.createElement("div");
      this.description.classList.add("sort-description");
      this.container.appendChild(this.description);
    }

    this.description.innerHTML = "";
    this.description.innerHTML = text;
  }

  setBlockWidth(blockWidth = this.blocks?.[0]?.getWidth(), blockMargin = 2) {
    this.blockWidth = blockWidth;
    this.blockMargin = blockMargin;
    // width:Number
    const blockCount = this.blocks.length;

    // 컨테이너 크기 넓히기
    this.container.style.width = blockCount * (blockWidth + blockMargin) + "px";

    // 블록 크기 바꾸기
    this.blocks.map((block, index) => {
      // 블록 애니메이션 속도를 0ms로 조정; 크기 변경을 즉각적으로 하기 위해
      const prevDuration = block.getTransitionDuration();
      block.setTransitionDuration(0);

      const newX = index * (blockWidth + blockMargin);
      block.setXPosition(newX);

      // 블록의 너비 조정
      block.setWidth(blockWidth);

      // 애니메이션 속도를 원래대로 조정
      block.setTransitionDuration(prevDuration);
    });
  }

  addBlock(blockValue) {
    // 블록 개수 제한
    if (this.blocks.length > 30) return;

    const block = Block.createNewBlock(
      blockValue,
      this.container,
      this.blockWidth,
      this.blockMargin
    );

    this.blocks.push(block);

    const containerWidth = this.blocks
      .map((b) => b.getWidth())
      .reduce(
        (containerWidth, blockWidth) =>
          containerWidth + this.blockMargin + blockWidth,
          0
      );
    this.container.style.width = `${containerWidth}px`;
  }

  removeBlock(blockValue) {
    if (blockValue instanceof String) blockValue = Number(blockValue);

    const targetIndex = this.blocks.findIndex(
      (block) => block.getValue() == blockValue
    );
    // 포함되었는지 확인
    // targetIndex가 -1이면 blockValue가 현재 블록들에 없는 값
    if (targetIndex == -1) return;

    // 삭제할 노드의 오른쪽에 있는 블록들 위치 한 칸 왼쪽으로 밀기
    for (let i = this.blocks.length - 1; i > targetIndex; i--) {
      const leftX = this.blocks[i - 1].getXPosition();
      this.blocks[i].setXPosition(leftX);
    }

    // this.blocks에서 삭제
    const targetBlock = this.blocks.splice(targetIndex, 1)[0];
    // DOM 삭제
    targetBlock.dom.remove();

    const containerWidth = this.blocks
      .map((b) => b.getWidth())
      .reduce(
        (containerWidth, blockWidth) =>
          containerWidth + this.blockMargin + blockWidth,
          0
      );
    this.container.style.width = `${containerWidth}px`;
  }

  setDelay(millis) {
    this.delay = millis;
  }

  setAnimationDelay(millis) {
    this.animationDelay = millis;
    this.blocks.forEach((block) =>
      block.setTransitionDuration(this.animationDelay)
    );
  }

  // this.blocks를 시각화되고있는 순서에 맞게 정렬하는 함수
  refreshBlocks() {
    const doms = Array.from(document.querySelectorAll(".block"));

    this.blocks.sort((b1, b2) => doms.indexOf(b1.dom) - doms.indexOf(b2.dom));
  }

  // target1과 tatget2의 위치를 바꿈
  // target1이 항상 target2보다 앞에 있어야 함
  async swap(block1, block2) {
    // block1: Block, block2: Block

    const x1 = block1.getXPosition();
    const x2 = block2.getXPosition();

    block1.setXPosition(x2);
    block2.setXPosition(x1);

    // 애니메이션이 끝나기를 기다림.
    await block1.swapBlock(block2);
  }

  // target을 destIndex 자리에 넣는 함수
  // target은 항상 destIndex보다 뒤에 있어야함
  async insertAt(block, destIndex) {
    const blocks = this.blocks;

    block.setXPosition(destIndex * (this.blockWidth + this.blockMargin));

    // 애니메이션이 끝나기를 기다림.
    await block.insertBefore(blocks[destIndex]);
  }

  // start 인덱스부터 end 인덱스까지 block 한 칸씩 미는 함수
  async shift(start, end) {
    const blocks = this.blocks;

    const betweens = blocks.filter((_, i) => start <= i && i < end);

    const xRest = betweens.map((b) => b.getXPosition());
    for (let i = 0; i < betweens.length - 1; i++) {
      betweens[i].setXPosition(xRest[i + 1]);
    }
    blocks[end - 1].setXPosition(blocks[end].getXPosition());

    await new Promise((res) =>
      setTimeout(res, blocks[0].getTransitionDuration())
    );
  }
}

module.exports = Sort;
