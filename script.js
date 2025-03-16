const state={
  isLoading: false, 
  data:[],
  errors:""
}
const allProducts = document.querySelector(".-product-cards-parent");
const alertBootstrap = document.querySelector(".-aside-alert")

allProducts.addEventListener("click", function(e){
  console.log("Clicked element:", e.target);
  if (e.target.classList.contains("-cart-btn")){
    alertBootstrap.innerHTML = "";
    alertBootstrap.innerHTML=alertBoostrapCode("product added to cart");
  }else if(e.target.classList.contains("-save-btn")){
    alertBootstrap.innerHTML = "";
    alertBootstrap.innerHTML=alertBoostrapCode("saved to bookmarks");
  }
})



const alertBoostrapCode=msg=>(`<div class="alert alert-success alert-dismissible show" role="alert">
                    <i class="bi bi-check-circle-fill"></i>
                    <span class="alert-msg">${msg}</span>
                    <button type="button" class="btn-close -b-remove-focus" data-bs-dismiss="alert" aria-label="close"></button>
                </div>`)

const cardStructureHOF=()=>{
  
  const stars=num=>{
    let v = Math.ceil(num);
    let stars=[];
    for (let i=1;i<=v;i++){
      stars.push('<i class="bi bi-star-fill text-warning"></i>')
    }
    return stars;
  }

  const INR=num=>Math.ceil(num*86);

  return function(img, productName, price, ratings, Rcount){
    return (`
    <section class="col-lg-3 m-3 card shadow rounded-0 p-3" style="max-width: 250px;">
                        
        <div class="border rounded
        d-flex align-items-center p-2
        " style="aspect-ratio: 9/16" >
          <img class="card-img-top img-fluid" src="${img}" alt="${productName}">
        </div>
          <div class="card-body">
                <a class="text-decoration-none" href="productPage.html">
                    <p class="card-title fw-bold">${productName}</p>
                </a>
              <div class="card-text">
                  <p>
                      <span class="stars">
                        
                      ${stars(ratings).join(' ')}
                        
                      </span> by <span class="rated-people"> ${Rcount} </span> people
                  </p>
                  <p class="fw-bold"> Price: <span class="product-price">${INR(price)}</span> &#8377 </p>
                  <div class="-card-buttons">
                      <button class="btn btn-outline-dark -cart-btn">Add to cart</button>
                      <button class="-save-btn btn btn-dark">
                          <i class="bi bi-bookmark-star -save-btn"></i>
                      </button>
                  </div>
              </div>
          </div>
      </section>`)
    }
}

const cardStructure = cardStructureHOF();

const fetchData= async (url,state, func)=>{
  try{
    state.isLoading = true;
    const response = await fetch(url);

    if (!response.ok){
      throw new Error (`error: ${response.status}, ${response.statusText}`);
    }

    state.data = await response.json();

    func(state.data)
    
  }catch (err){
    state.errors = err.message;
  }finally{
    console.log("api called");
    state.isLoading = false;
  }
}



const placeItems=(items)=>{
  console.log("insidefunc", items)
  const products = items?.map((e,i)=>cardStructure(e.image, e.title, e.price,e.rating.rate, e.rating.count ));
  console.log(products)
  if (products.length>0){
    allProducts.innerHTML='';
    products.forEach(e=>{
      allProducts.innerHTML+=e;
    })
  }else{
    console.log("empty")
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  fetchData("https://fakestoreapi.com/products", state, placeItems);
})