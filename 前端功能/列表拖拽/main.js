const oUl = document.querySelector('ul');
let sourceNode;
oUl.addEventListener("dragstart", (e) => {
    setTimeout(() => {
        e.target.classList.add('move')
    })
    sourceNode = e.target;
})
oUl.addEventListener("dragenter", e => {
    if (e.target === oUl || e.target === sourceNode) return;
    const sourceIndex = Array.from(oUl.children).indexOf(sourceNode);
    const index = Array.from(oUl.children).indexOf(e.target);
    oUl.insertBefore(sourceNode, index > sourceIndex ? e.target.nextSibling : e.target);
})
oUl.addEventListener("dragend", e => {
    e.target.classList.remove('move');
})
