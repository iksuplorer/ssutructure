// import * as Treeviz from 'treeviz';
const Treeviz = require('treeviz');

let data_1 = [
    { id: 1, text_1: "Chaos", text_2: "Void", father: null, color:"#FF5722" },
    { id: 2, text_1: "Tartarus", text_2: "Abyss", father: 1, color:"#FFC107" },
    { id: 3, text_1: "Gaia", text_2: "Earth", father: 1, color:"#8BC34A" },
    { id: 4, text_1: "Eros", text_2: "Desire", father: 1,  color:"#00BCD4" }];

let data_2 = [
    { id: 1, text_1: "Chaos", text_2: " Void", father: null, color:"#2196F3" },
    { id: 2, text_1: "Tartarus", text_2: "Abyss", father: 1 ,color:"#F44336"},
    { id: 3, text_1: "Gaia", text_2: "Earth", father: 1,color:"#673AB7" },
    { id: 4, text_1: "Eros", text_2: "Desire", father: 1,color:"#009688" },
    { id: 5, text_1: "Uranus", text_2: "Sky", father: 3,color:"#4CAF50" },
    { id: 6, text_1: "Ourea", text_2: "Mountains", father: 3,color:"#FF9800" }];

    let data_3 = [
    { id: 1, text_1: "Chaos", text_2: "Void", father: null, color:"#2196F3" },
    { id: 2, text_1: "Tartarus", text_2: "Abyss", father: 1 ,color:"#F44336"},
    { id: 3, text_1: "Gaia", text_2: "Earth", father: 1,color:"#673AB7" },
    { id: 4, text_1: "Eros", text_2: "Desire", father: 1,color:"#009688" },
    { id: 5, text_1: "Uranus", text_2: "Sky", father: 3,color:"#4CAF50" },
    { id: 6, text_1: "Ourea", text_2: "Mountains", father: 3,color:"#FF9800" },
    { id: 7, text_1: "Hermes", text_2: " Sky", father: 4,color:"#2196F3" },
    { id: 8, text_1: "Aphrodite", text_2: "Love", father: 4,color:"#8BC34A" },
    { id: 3.3, text_1: "Love", text_2: "Peace", father: 8,color:"#c72e99" },
    { id: 4.1, text_1: "Hope", text_2: "Life", father: 8,color:"#2eecc7" }
    ];

let myTree = Treeviz.create({
    htmlId: "tree",
    idKey: "id",
    hasFlatData: true,
    relationnalField: "father",
    hasPanAndZoom: true,
    nodeWidth:120,
    nodeHeight:80,
    mainAxisNodeSpacing:2,
    isHorizontal:false,
    renderNode: function(node) { 
    return "<div class='box' style='cursor:pointer;height:"+node.settings.nodeHeight+"px; width:"+node.settings.nodeWidth+"px;display:flex;flex-direction:column;justify-content:center;align-items:center;background-color:"
            +node.data.color+
          ";border-radius:5px;'><div><strong>"
      +node.data.text_1+
      "</strong></div><div>is</div><div><i>"
      +node.data.text_2+
      "</i></div></div>";
    },
    linkWidth : (nodeData)=> 5,
    linkShape:"curve",
    linkColor : (nodeData) => "#B0BEC5" ,
    onNodeClick : (nodeData) => console.log(nodeData)
});
myTree.refresh(data_1);

setTimeout(() => {
    myTree.refresh(data_2);
    
    setTimeout(() => {
      myTree.refresh(data_3);
    }, 1500);

}, 1500);