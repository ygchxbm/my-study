const oUl=document.querySelector('ul');
let sourceNode;
oUl.addEventListener("dragstart",(e)=>{
    console.log(e.target);
    setTimeout(()=>{
        e.target.classList.add('move')
    })
    sourceNode=e.target;
})
oUl.addEventListener("dragenter",e=>{
    if(e.target===oUl||e.target===sourceNode) return;
    console.log(e.target)
})
oUl.addEventListener("dragend",e=>{

})
