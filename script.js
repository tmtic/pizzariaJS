let modalQt = 1;
let modalKey = 0;
let cart = [];

const qs = (el) => document.querySelector(el);
const qsall = (el) => document.querySelectorAll(el);


//Listagem das Pizzas

pizzaJson.map((item, index)=>{
	let pizzaItem = qs('.models .pizza-item').cloneNode(true);

	pizzaItem.setAttribute('data-key', index);

	//console.log(pizzaItem);

	// Preencher as informações em pizzaItem
	pizzaItem.querySelector('.pizza-item--img img').src = item.img;
	pizzaItem.querySelector('.pizza-item--price').innerHTML = item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
	pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

	pizzaItem.querySelector('a').addEventListener('click', (e) => {
		e.preventDefault();

		let key = e.target.closest('.pizza-item').getAttribute('data-key');
		modalQt = 1;
		modalKey = key;

		qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
		qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
		qs('.pizzaBig img').src = pizzaJson[key].img;

		qs('.pizzaInfo--size.selected').classList.remove('selected');
		qs('.pizzaInfo--qt').innerHTML = modalQt;

		qsall('.pizzaInfo--size').forEach((size, sizeIndex) => {
			
			if(sizeIndex == 2) {
				size.classList.add('selected');
			}
			size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
		});

		qs('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

		qs('.pizzaWindowArea').style.opacity = 0;
		qs('.pizzaWindowArea').style.display = 'flex';
		setTimeout(()=>{
			qs('.pizzaWindowArea').style.opacity = 0.96;
		}, 300);

	});

	qs(".pizza-area").append(pizzaItem);
});


// Eventos do Modal
function closeModal() {
	qs('.pizzaWindowArea').style.opacity = 0;
	setTimeout(()=>{
			qs('.pizzaWindowArea').style.display = 'none';
		}, 300);
}

qsall('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
	item.addEventListener('click', closeModal);
});

qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
	if (qs('.pizzaInfo--qt').innerHTML > 1) {
		modalQt--;
		qs('.pizzaInfo--qt').innerHTML = modalQt;
	} 
});



qs('.pizzaInfo--qtmais').addEventListener('click', () => {
	modalQt++;
	qs('.pizzaInfo--qt').innerHTML = modalQt;
});

qsall('.pizzaInfo--size').forEach((size,sizeIndex) => {
	size.addEventListener('click', (e) => {
		qs('.pizzaInfo--size.selected').classList.remove('selected');
		size.classList.add('selected'); 
	});
});


qs('.pizzaInfo--addButton').addEventListener('click', () => {
	let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
	let identifier = pizzaJson[modalKey].id + '@' + size;
	let key = cart.findIndex((item) => item.identifier == identifier)

	if(key > -1) {
		cart[key].qt += modalQt;

	} else {

		cart.push({
			identifier,
			id: pizzaJson[modalKey].id,
			size,
			qt: modalQt
		});
	}

	updateCart();
	closeModal();

});

function updateCart() {

	qs('.menu-openner span').innerHTML = cart.length;

	if(cart.length > 0) {
		qs('aside').classList.add('show');

		qs('.cart').innerHTML = '';
		let subtotal = 0, desconto = 0, total = 0;

		for(let i in cart) {
			let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
			subtotal += pizzaItem.price * cart[i].qt;
			let cartItem = qs(".models .cart--item").cloneNode(true);
			let pizzaSizeName;

			switch(cart[i].size) {
				case 0:
					pizzaSizeName = 'P';
					break;
				case 1:
					break;
					pizzaSizeName = 'M';
				case 2:
					pizzaSizeName = 'G';
					break;
			}

			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
			
			cartItem.querySelector('img').src = pizzaItem.img;
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				if(cart[i].qt > 1) {
					cart[i].qt--;
					
				} else {
					cart.splice(i,1)
				}

				updateCart();
			});
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				cart[i].qt++;
				updateCart();
			});

			qs('.cart').append(cartItem);

			desconto = subtotal * 0.1;
			total = subtotal - desconto;

			qs('.subtotal span:last-child').innerHTML = subtotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
			qs('.desconto span:last-child').innerHTML = desconto.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
			qs('.total span:last-child').innerHTML = total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

		}


	} else {
		qs('aside').classList.remove('show');
		qs('aside').style.left = '200vw';
	}
}

qs('.menu-openner').addEventListener('click', (e) => {
	if(cart.length > 0) { 
		qs('aside').style.left = 0;
	}

qs('.menu-closer').addEventListener('click', () => {
	qs('aside').style.left = '200vw';
})

});