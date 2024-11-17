let navbar=document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick=()=>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

let searchForm=document.querySelector('.search-form');

document.querySelector('#search-btn').onclick=()=>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}

let cartItem=document.querySelector('.cart-items-container');
document.querySelector('#cart-btn').onclick=()=>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

window.onscroll=()=>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}



// ----------------------------------------------------------------------------------------





let body=document.querySelector('body');
let listProductHTML=document.querySelector('.box-container')
let listCartHtml=document.querySelector('.cart-items-container')


let listProduct=[];
let carts=[];

// Add product from the json file to HTML

const addDataToHTML=()=>{
    listProductHTML.innerHTML='';
    if (listProduct.length>0){
        listProduct.forEach(product =>{
            let newProduct=document.createElement('div');
            newProduct.classList.add('box')
            newProduct.dataset.id=product.id;
            newProduct.innerHTML=`
                <img src="${product.image}" alt="image not found">
                <h3>${product.name}</h3>
                <div class="price">$${product.price}<span>20.99</span></div>
                <a href="#" class="btn addCart">Add to cart</a>
            `;

            listProductHTML.appendChild(newProduct);
        })
    }
}

listProductHTML.addEventListener('click',(event)=>{
    event.preventDefault(); // Prevents any default link behavior
    let positionClick=event.target;
    if(positionClick.classList.contains('addCart')){
        
        let product_id=positionClick.parentElement.dataset.id;
        addToCart(product_id);

        const cartContainer = document.querySelector('.header .cart-items-container');
        cartContainer.classList.add('active'); // Adds the 'active' class to show the cart
    }
})


// Check the product existance in cart and increase the quantity

const addToCart=(product_id)=>{
    let positionOfThisProductInCart=carts.findIndex((value)=>value.product_id==product_id)
    if (carts.length<=0){
        carts=[{
            product_id:product_id,
            quantity:1
        }]
    }else if(positionOfThisProductInCart<0){
        carts.push({
            product_id:product_id,
            quantity:1
        })
    }else{
        carts[positionOfThisProductInCart].quantity=carts[positionOfThisProductInCart].quantity+1;
    }
    addCartToHtml();
}


// Add product to cart from the webpage

const addCartToHtml=()=>{
    listCartHtml.innerHTML='';
    let totalQuantity=0;

    if (carts.length>0){
        carts.forEach(cart=>{
            totalQuantity=totalQuantity+cart.quantity;

            let newCart=document.createElement('div')
            newCart.classList.add('cart-item');
            

            newCart.dataset.id=cart.product_id;

            let positionProduct=listProduct.findIndex((value)=>value.id==cart.product_id);
            let info=listProduct[positionProduct];
            newCart.innerHTML=`
                <div class="image">
                    <img src="${info.image}" alt="No image">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalprice">$${(info.price*cart.quantity).toFixed(2)}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            </div>
            
            `;
            listCartHtml.appendChild(newCart);

        })
        //iconCartSpan.innerText=totalQuantity;
    }

    // Re-append the checkout button after rendering items
    const checkoutButton = document.createElement('a');
    checkoutButton.className = 'btn';
    checkoutButton.textContent = 'Checkout';
    listCartHtml.appendChild(checkoutButton);
};

// increase or decrease quantity of product in cart

listCartHtml.addEventListener('click', (event)=>{
    let positionedClicked=event.target;
    if(positionedClicked.classList.contains('minus')|| positionedClicked.classList.contains('plus')){
        let product_id=positionedClicked.closest('.cart-item').dataset.id;
        let type='minus';
        

        if(positionedClicked.classList.contains('plus')){
            type='plus';
            
        }
        console.log(type);
        changeQuantity(product_id,type);
    }
});

// Change quantity in the cart 

let changeQuantity=(product_id,type)=>{
    let positionItemInCart=carts.findIndex((value)=>value.product_id==product_id)
    if(positionItemInCart >=0){
        switch(type){

            case 'plus':
                carts[positionItemInCart].quantity=carts[positionItemInCart].quantity+1;
            break;

            default:
                let valueChange=carts[positionItemInCart].quantity-1;
                if(valueChange >0){
                    carts[positionItemInCart].quantity=valueChange;
                }else{
                    carts.splice(positionItemInCart,1);
                }
            break;
        }
    }

    addCartToHtml();
}


const initApp=()=>{
    //get data from json
    fetch('product.json')
    .then(response=>response.json())
    .then(data=>{
        listProduct=data;
        addDataToHTML();
    })
}

initApp();



