(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Sort = require('../sort/Sort');

class SelectionSort extends Sort {

    // container:DOM, delay:Number, animationDelay:Number
    constructor(container, blocks, delay, animationDelay) {
        super(container, blocks, delay, animationDelay);
    }

    async sort() {

        // block들 가져오기
        let blocks = this.getBlocks();
        // block들의 총 개수
        const n = blocks.length;
        let min;

        for (let i = 0; i < n - 1; i += 1) {
            min = i;
            for (let j = i + 1; j < n; j += 1) {
                // delay만큼 기다림
                blocks[i].setColorRed();
                await new Promise(resolve => setTimeout(resolve,this.delay));
                let value1 = blocks[min].getValue();
                let value2 = blocks[j].getValue();
                if (value1 >= value2)
                    min = j;
                if (i != min&&j==n-1) {
                    await this.swap(blocks[min], blocks[i]);
			min = i;
                    // 두 블록의 위치가 바뀌었으므로 기존 blocks를 업데이트
                    blocks = this.getBlocks();
                }
		blocks[i].setColorDefault();
                blocks[j].setColorDefault();
            }
        blocks[i].setColorGreen();
    }
}
}
module.exports = SelectionSort;

},{"../sort/Sort":4}],2:[function(require,module,exports){
const SelectionSort = require('./SelectionSort');
const Block = require('../sort/Block');

const container = document.querySelector('.data-container');

// 0~100 사이 랜덤 값을 가지는 블록 num개 생성 
function generateBlocks(num = 20,container) {
    const blocks = [];
    for (let i = 0; i < num; i += 1) {
        const value = Math.floor(Math.random() * 100);
        const block = Block.createNewBlock(value,container);
        blocks.push(block);
    }
    return blocks;
}

const blocks = generateBlocks(20,container);
const selectionSort = new SelectionSort(container,blocks,200,250);

selectionSort.sort();

},{"../sort/Block":3,"./SelectionSort":1}],3:[function(require,module,exports){
class Block {
    // static factory method; value와 container를 이용해 Block 객체를 만든다
    static createNewBlock(value, container) {   // value:Number, container:DOM
        const blockCount = container.childElementCount;

        const block = document.createElement("div");
        block.classList.add("block");
        block.style.height = `${value * 3}px`;
        block.style.transform = `translateX(${blockCount * 30}px)`;

        const blockLabel = document.createElement("label");
        blockLabel.classList.add("block__id");
        blockLabel.innerHTML = value;

        block.appendChild(blockLabel);
        container.appendChild(block);
        return new Block(block,container);
    }

    constructor(dom, container) {
        this.dom = dom;
        this.container = container;
    }

    // block을 선택된 블록의 색으로 바꾸는 함수
    setColorRed() {
        this.dom.style.backgroundColor = "#FF4949";
    }

    // block을 기본 블록의 색으로 바꾸는 함수
    setColorDefault() {
        this.dom.style.backgroundColor = "#58B7FF";
    }

    // block을 정렬이 끝난 블록의 색으로 바꾸는 함수
    setColorGreen() {
        this.dom.style.backgroundColor = "#13CE66";
    }
    // block의 value를 반환하는 함수
    getValue() {
        return Number(this.dom.childNodes[0].innerHTML);
    }

}

module.exports = Block;
},{}],4:[function(require,module,exports){


// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
    constructor( container,blocks, delay=200, animationDelay=250) {
        this.blocks = blocks;
        this.container = container;
        this.delay = delay;
        this.animationDelay = animationDelay;
    }

    // 추상 메소드
    sort() {

    }
    
    // 모든 block들을 리턴하는 함수
    getBlocks() {

        const doms = Array.from(document.querySelectorAll(".block"));
        
        this.blocks.sort((b1,b2) => doms.indexOf(b1.dom) - doms.indexOf(b2.dom));

        return this.blocks;
    }

    // target1과 tatget2의 위치를 바꿈
    // target1이 항상 target2보다 앞에 있어야 함
    swap(block1, block2) {  // block1: Block, block2: Block
        return new Promise(resolve => {
            const style1 = window.getComputedStyle(block1.dom);
            const style2 = window.getComputedStyle(block2.dom);

            const transform1 = style1.getPropertyValue("transform");
            const transform2 = style2.getPropertyValue("transform");

            block1.dom.style.transform = transform2;
            block2.dom.style.transform = transform1;

            const nextOfTarget1 = block1.dom.nextSibling;
            const nextOfTarget2 = block2.dom.nextSibling;

            // 애니메이션이 끝나기를 기다림.
            window.requestAnimationFrame(()=> {
                setTimeout(() => {
                    this.container.insertBefore(block1.dom, nextOfTarget2);
                    this.container.insertBefore(block2.dom, nextOfTarget1);
                    resolve();
                }, this.animationDelay);
            });
        });
    }

    // target을 destIndex 자리에 넣고 원래 destIndex의 element부터 한 칸씩 뒤로 미는 함수
    // target은 항상 destIndex보다 뒤에 있어야함
    insertAt(block, destIndex) {
        return new Promise(resolve => {

            const arr = Array.from(document.querySelectorAll(".block"));

            // target의 인덱스
            const targetIndex = arr.indexOf(block.dom);

            // destInde와 target 사이에 있는 블록들
            const betweens = arr.filter((_, i) => destIndex <= i && i < targetIndex);

            const style1 = window.getComputedStyle(block.dom);
            const styleRest = betweens.map(dom => window.getComputedStyle(dom));

            const transform1 = style1.getPropertyValue("transform");
            const transformRest = styleRest.map(style => style.getPropertyValue("transform"));

            block.dom.style.transform = transformRest[0];
            for (let i = 0; i < betweens.length - 1; i++) {
                betweens[i].style.transform = transformRest[i + 1];
            }
            betweens[betweens.length - 1].style.transform = transform1;

            // 애니메이션이 끝나기를 기다림.
            window.requestAnimationFrame(()=> {
                setTimeout(() => {
                    this.container.insertBefore(block.dom, betweens[0]);
                    resolve();
                }, this.animationDelay);
            });
        });
    }
}

module.exports = Sort;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIlNlbGVjdGlvblNvcnQuanMiLCJpbmRleC5qcyIsIi4uL3NvcnQvQmxvY2suanMiLCIuLi9zb3J0L1NvcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoJy4uL3NvcnQvU29ydCcpO1xyXG5cclxuY2xhc3MgU2VsZWN0aW9uU29ydCBleHRlbmRzIFNvcnQge1xyXG5cclxuICAgIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJsb2NrcywgZGVsYXksIGFuaW1hdGlvbkRlbGF5KSB7XHJcbiAgICAgICAgc3VwZXIoY29udGFpbmVyLCBibG9ja3MsIGRlbGF5LCBhbmltYXRpb25EZWxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc29ydCgpIHtcclxuXHJcbiAgICAgICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXHJcbiAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMuZ2V0QmxvY2tzKCk7XHJcbiAgICAgICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxyXG4gICAgICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xyXG4gICAgICAgIGxldCBtaW47XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbiAtIDE7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBtaW4gPSBpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuOyBqICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlbGF566eM7YG8IOq4sOuLpOumvFxyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yUmVkKCk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSx0aGlzLmRlbGF5KSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUxID0gYmxvY2tzW21pbl0uZ2V0VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZTEgPj0gdmFsdWUyKVxyXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGo7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBtaW4mJmo9PW4tMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbbWluXSwgYmxvY2tzW2ldKTtcclxuXHRcdFx0bWluID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDrkZAg67iU66Gd7J2YIOychOy5mOqwgCDrsJTrgIzsl4jsnLzrr4DroZwg6riw7KG0IGJsb2Nrc+ulvCDsl4XrjbDsnbTtirhcclxuICAgICAgICAgICAgICAgICAgICBibG9ja3MgPSB0aGlzLmdldEJsb2NrcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cdFx0YmxvY2tzW2ldLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yRGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgYmxvY2tzW2ldLnNldENvbG9yR3JlZW4oKTtcclxuICAgIH1cclxufVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU29ydDtcclxuIiwiY29uc3QgU2VsZWN0aW9uU29ydCA9IHJlcXVpcmUoJy4vU2VsZWN0aW9uU29ydCcpO1xyXG5jb25zdCBCbG9jayA9IHJlcXVpcmUoJy4uL3NvcnQvQmxvY2snKTtcclxuXHJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRhLWNvbnRhaW5lcicpO1xyXG5cclxuLy8gMH4xMDAg7IKs7J20IOuenOuNpCDqsJLsnYQg6rCA7KeA64qUIOu4lOuhnSBudW3qsJwg7IOd7ISxIFxyXG5mdW5jdGlvbiBnZW5lcmF0ZUJsb2NrcyhudW0gPSAyMCxjb250YWluZXIpIHtcclxuICAgIGNvbnN0IGJsb2NrcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW07IGkgKz0gMSkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwKTtcclxuICAgICAgICBjb25zdCBibG9jayA9IEJsb2NrLmNyZWF0ZU5ld0Jsb2NrKHZhbHVlLGNvbnRhaW5lcik7XHJcbiAgICAgICAgYmxvY2tzLnB1c2goYmxvY2spO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJsb2NrcztcclxufVxyXG5cclxuY29uc3QgYmxvY2tzID0gZ2VuZXJhdGVCbG9ja3MoMjAsY29udGFpbmVyKTtcclxuY29uc3Qgc2VsZWN0aW9uU29ydCA9IG5ldyBTZWxlY3Rpb25Tb3J0KGNvbnRhaW5lcixibG9ja3MsMjAwLDI1MCk7XHJcblxyXG5zZWxlY3Rpb25Tb3J0LnNvcnQoKTtcclxuIiwiY2xhc3MgQmxvY2sge1xyXG4gICAgLy8gc3RhdGljIGZhY3RvcnkgbWV0aG9kOyB2YWx1ZeyZgCBjb250YWluZXLrpbwg7J207Jqp7ZW0IEJsb2NrIOqwneyytOulvCDrp4zrk6Dri6RcclxuICAgIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyKSB7ICAgLy8gdmFsdWU6TnVtYmVyLCBjb250YWluZXI6RE9NXHJcbiAgICAgICAgY29uc3QgYmxvY2tDb3VudCA9IGNvbnRhaW5lci5jaGlsZEVsZW1lbnRDb3VudDtcclxuXHJcbiAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGJsb2NrLmNsYXNzTGlzdC5hZGQoXCJibG9ja1wiKTtcclxuICAgICAgICBibG9jay5zdHlsZS5oZWlnaHQgPSBgJHt2YWx1ZSAqIDN9cHhgO1xyXG4gICAgICAgIGJsb2NrLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7YmxvY2tDb3VudCAqIDMwfXB4KWA7XHJcblxyXG4gICAgICAgIGNvbnN0IGJsb2NrTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICAgICAgYmxvY2tMYWJlbC5jbGFzc0xpc3QuYWRkKFwiYmxvY2tfX2lkXCIpO1xyXG4gICAgICAgIGJsb2NrTGFiZWwuaW5uZXJIVE1MID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGJsb2NrLmFwcGVuZENoaWxkKGJsb2NrTGFiZWwpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBCbG9jayhibG9jayxjb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGRvbSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5kb20gPSBkb207XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYmxvY2vsnYQg7ISg7YOd65CcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gICAgc2V0Q29sb3JSZWQoKSB7XHJcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjRkY0OTQ5XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYmxvY2vsnYQg6riw67O4IOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxyXG4gICAgc2V0Q29sb3JEZWZhdWx0KCkge1xyXG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU4QjdGRlwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGJsb2Nr7J2EIOygleugrOydtCDrgZ3rgpwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXHJcbiAgICBzZXRDb2xvckdyZWVuKCkge1xyXG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzEzQ0U2NlwiO1xyXG4gICAgfVxyXG4gICAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxyXG4gICAgZ2V0VmFsdWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmRvbS5jaGlsZE5vZGVzWzBdLmlubmVySFRNTCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrOyIsIlxyXG5cclxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXHJcbmNsYXNzIFNvcnQge1xyXG4gICAgY29uc3RydWN0b3IoIGNvbnRhaW5lcixibG9ja3MsIGRlbGF5PTIwMCwgYW5pbWF0aW9uRGVsYXk9MjUwKSB7XHJcbiAgICAgICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xyXG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRGVsYXkgPSBhbmltYXRpb25EZWxheTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDstpTsg4Eg66mU7IaM65OcXHJcbiAgICBzb3J0KCkge1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8g66qo65OgIGJsb2Nr65Ok7J2EIOumrO2EtO2VmOuKlCDtlajsiJhcclxuICAgIGdldEJsb2NrcygpIHtcclxuXHJcbiAgICAgICAgY29uc3QgZG9tcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsYjIpID0+IGRvbXMuaW5kZXhPZihiMS5kb20pIC0gZG9tcy5pbmRleE9mKGIyLmRvbSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5ibG9ja3M7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGFyZ2V0MeqzvCB0YXRnZXQy7J2YIOychOy5mOulvCDrsJTqv4hcclxuICAgIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcclxuICAgIHN3YXAoYmxvY2sxLCBibG9jazIpIHsgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlMSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJsb2NrMS5kb20pO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZTIgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jazIuZG9tKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybTEgPSBzdHlsZTEuZ2V0UHJvcGVydHlWYWx1ZShcInRyYW5zZm9ybVwiKTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMiA9IHN0eWxlMi5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG5cclxuICAgICAgICAgICAgYmxvY2sxLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm0yO1xyXG4gICAgICAgICAgICBibG9jazIuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTE7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gYmxvY2sxLmRvbS5uZXh0U2libGluZztcclxuICAgICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrMi5kb20ubmV4dFNpYmxpbmc7XHJcblxyXG4gICAgICAgICAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKT0+IHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShibG9jazEuZG9tLCBuZXh0T2ZUYXJnZXQyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYmxvY2syLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5hbmltYXRpb25EZWxheSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRhcmdldOydhCBkZXN0SW5kZXgg7J6Q66as7JeQIOuEo+qzoCDsm5DrnpggZGVzdEluZGV47J2YIGVsZW1lbnTrtoDthLAg7ZWcIOy5uOyUqSDrkqTroZwg66+464qUIO2VqOyImFxyXG4gICAgLy8gdGFyZ2V07J2AIO2VreyDgSBkZXN0SW5kZXjrs7Tri6Qg65Kk7JeQIOyeiOyWtOyVvO2VqFxyXG4gICAgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ibG9ja1wiKSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0YXJnZXTsnZgg7J24642x7IqkXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEluZGV4ID0gYXJyLmluZGV4T2YoYmxvY2suZG9tKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGRlc3RJbmRl7JmAIHRhcmdldCDsgqzsnbTsl5Ag7J6I64qUIOu4lOuhneuTpFxyXG4gICAgICAgICAgICBjb25zdCBiZXR3ZWVucyA9IGFyci5maWx0ZXIoKF8sIGkpID0+IGRlc3RJbmRleCA8PSBpICYmIGkgPCB0YXJnZXRJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzdHlsZTEgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShibG9jay5kb20pO1xyXG4gICAgICAgICAgICBjb25zdCBzdHlsZVJlc3QgPSBiZXR3ZWVucy5tYXAoZG9tID0+IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtMSA9IHN0eWxlMS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1SZXN0ID0gc3R5bGVSZXN0Lm1hcChzdHlsZSA9PiBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFwidHJhbnNmb3JtXCIpKTtcclxuXHJcbiAgICAgICAgICAgIGJsb2NrLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1SZXN0WzBdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYmV0d2VlbnNbaV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtUmVzdFtpICsgMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYmV0d2VlbnNbYmV0d2VlbnMubGVuZ3RoIC0gMV0uc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtMTtcclxuXHJcbiAgICAgICAgICAgIC8vIOyVoOuLiOuplOydtOyFmOydtCDrgZ3rgpjquLDrpbwg6riw64uk66a8LlxyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgYmV0d2VlbnNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVsYXkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTb3J0O1xyXG4iXX0=
