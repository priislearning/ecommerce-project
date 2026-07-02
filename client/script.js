
document.addEventListener('DOMContentLoaded',()=>{
    const cart=[];
    const productlist=document.getElementById("product-list");
    const cartitems=document.getElementById("cart-items");
    const emptycarmessage=document.getElementById("empty-cart");
    const carttotalmessage=document.getElementById("cart-total");
    const totalpricedisplay=document.getElementById("total-price");
    const checkoutbtn=document.getElementById("checkout-btn");
    //now to display products run a loop over the products we will render it make a display div 
    products.forEach(product=>{
        const productdiv=document.createElement('div')
        productdiv.className="bg-zinc-800 p-2 rounded flex justify-between items-center mb-3 text-white"
        productdiv.innerHTML=`
        <span>${product.name}-$${product.price.toFixed(2)}</span>
        <button data-id="${product.id}">Add to cart</button>
        `;//now its just hanging in the air we havew to attach it
        productlist.appendChild(productdiv);     

    })   
    //now i want to do something when someone click on button not on whole div
    productlist.addEventListener("click", (e)=>{
        if(e.target.tagName==='BUTTON'){
            //ID IS COMING AS STRING THEREFORE WE CONVERT TO INT
            const productid=parseInt(e.target.getAttribute("data-id"))
            const product=products.find(p=>p.id===productid)
            addtocart(product)
        }
    })
    function addtocart(product){
        cart.push(product);
        rendercart();
    }
    function rendercart(){
        cartitems.innerHTML=""//remove everything
        let totalprice=0
        if(cart.length>0){
            emptycarmessage.classList.add("hidden")
            carttotalmessage.classList.remove("hidden")
            cart.forEach((item, index) =>{
                totalprice+=item.price
                const cartitem=document.createElement("div")
                 cartitem.innerHTML=`
                 ${item.name}-$${item.price}
                 `
                 cartitems.appendChild(cartitem)
                 totalpricedisplay.textContent=`${totalprice}`
            })
        }else{
             emptycarmessage.classList.remove("hidden");
             totalpricedisplay.textContent=`0.00`
        }
    }
    checkoutbtn.addEventListener("click",()=>{
        cart.length=0;
        alert("checkout sucsessfully")
        rendercart();
    })
})