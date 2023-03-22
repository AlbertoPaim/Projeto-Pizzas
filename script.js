let cart = [];
let modalQt = 1;
let modalKey = 0;

// para nao precisar selecionar o DOM
const d = (elemento) => document.querySelector(elemento);
const all = (elemento) => document.querySelectorAll(elemento);

//criar um clone dos modelos
pizzaJson.map((item, index) => {
  let pizzaItem = d(".models .pizza-item").cloneNode(true);

  pizzaItem.setAttribute("data-key", index); //AQUI EU SETTEI UM ATRIBUTO COM A NUMERAÇÃO

  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();

    let key = e.target.closest(".pizza-item").getAttribute("data-key"); // AQUI EU PEGUEI O ATRIBUTO
    modalQt = 1;
    modalKey = key;
    //BANNER DEPOIS QUE APERTA NA PIZZA
    d(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    d(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    d(".pizzaBig img").src = pizzaJson[key].img;
    d(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`;
    d(".pizzaInfo--size.selected").classList.remove("selected");

    all(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex === 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    d(".pizzaInfo--qt").innerHTML = modalQt;

    //TRANSITION
    d(".pizzaWindowArea").style.opacity = 0;
    d(".pizzaWindowArea").style.display = "flex";

    setTimeout(() => {
      d(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  d(".pizza-area").append(pizzaItem);
});

//FECHAR O MODAL

function closeModal() {
  d(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    d(".pizzaWindowArea").style.display = "none";
  }, 500);
}

// PARA ADICIONAR QUANTIDADE OU DIMINUIR
d(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    d(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

d(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  d(".pizzaInfo--qt").innerHTML = modalQt;
});

//PARA REMOVER E ADICIONAR O TAMANHO DA PIZZA
all(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", () => {
    d(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

//CRIAR UM IDENTIFIADOR DA PIZZA E O TAMANHO PARA O CARRINHO E ADICIONAR

d(".pizzaInfo--addButton").addEventListener("click", () => {
  let sizeCart = d(".pizzaInfo--size.selected").getAttribute("data-key");

  let identifier = pizzaJson[modalKey].id + "@" + sizeCart;

  let key = cart.findIndex((item) => item.identifier == identifier);

  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      sizeCart,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

d(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    d("aside").style.left = "0";
  }

});


d('.menu-closer').addEventListener('click', ()=>{
    d("aside").style.left = "100vw";
})
//UPDATECART PAR ATUALIZAR AS INFORMAÇÕES DO CARRINHO

function updateCart() {
  d(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    d("aside").classList.add("show");
    d(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;
    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

      subtotal += pizzaItem.price * cart[i].qt;

      let cartItem = d(".models .cart--item").cloneNode(true);

      //PARA PEGAR O TAMANHO DA PIZZA E BOTAR NO CARRINHO
      let pizzaSizeName = cart[i].size;
      switch (cart[i].sizeCart) {
        case "0":
          pizzaSizeName = "P";
          break;
        case "1":
          pizzaSizeName = "M";
          break;
        case "2":
          pizzaSizeName = "G";
          break;
      }

      let pizzaName = `${pizzaItem.name}(${pizzaSizeName})`;

      //ITENS PARA PREENCHER NO CARRINHO
      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });

      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      d(".cart").append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    d(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    d(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    d(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    d("aside").classList.remove("show");
    d("aside").style.left = "100vw";
  }
}
