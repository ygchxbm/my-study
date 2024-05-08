const oUl = document.querySelector('.drag-list');
const children = document.querySelectorAll(".drag-item");
children.forEach(item=>{
    item.draggable=true;
})
let sourceNode;
oUl.addEventListener("dragstart", (e) => {
    // console.log(e.target);
    setTimeout(() => {
        e.target.classList.add('move')
    })
    sourceNode = e.target;
    e.dataTransfer.effectAllowed='move';
})
oUl.addEventListener("dragenter", e => {
    e.preventDefault()
    if (e.target === oUl || e.target === sourceNode) return;

    let sourceIndex, endIndex;
    const children = document.querySelectorAll(".drag-item");
    children.forEach((item, index) => {
        if (item === sourceNode) {
            sourceIndex = index;
        } else if (item === e.target) {
            endIndex = index
        }
    })
    console.log(sourceIndex, endIndex)
    if (endIndex > sourceIndex) {
        oUl.insertBefore(e.target, sourceNode)
    } else {
        oUl.insertBefore(sourceNode, e.target)
    }
})

oUl.addEventListener("dragover", e => {
    e.preventDefault()
})

oUl.addEventListener("dragend", e => {
    e.target.classList.remove('move')
})

window.addEventListener('dragover',e=>{
    e.preventDefault()
})
