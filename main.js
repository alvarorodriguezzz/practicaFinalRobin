// URL de la API
const apiUrl = 'https://products-foniuhqsba-uc.a.run.app/Drones';



// boton ver catalogo hace un scroll mas lento
document.addEventListener('DOMContentLoaded', () => {
  const productId = getProductId();
  if (productId) {
    fetchProductDetails(productId);
  }


  const catalogButton = document.querySelector("a[href='#product-grid']");
  if (catalogButton) {
    catalogButton.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector("#product-grid"); 
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset; 

        // Animar el desplazamiento
        window.scrollTo({
          top: targetPosition - 80, 
          behavior: "smooth", 
        });
      }
    });
  }
});

//buscador
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.dialog-search');
  const dialog = document.querySelector('custom-search dialog');
  const closeButton = dialog.querySelector('.close-btn');
  const searchInput = document.querySelector('#site-search');
  const searchResults = document.querySelector('#search-results');
  const template = document.querySelector('custom-search template').content;

  let products = [];

  // cargo productos desde la api
  async function fetchProducts() {
    try {
      const response = await fetch('https://products-foniuhqsba-uc.a.run.app/Drones');
      products = await response.json();
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

//abro dialogo
  searchButton.addEventListener('click', () => {
    dialog.showModal();
  });

//cierro dialogo
  closeButton.addEventListener('click', () => {
    dialog.close();
  });

//filtro mientras escribe
  searchInput.addEventListener('input', (event) => {
    const term = event.target.value.toLowerCase();
    renderResults(term);
  });

//renderizo lo q hay
  function renderResults(term = '') {
    searchResults.innerHTML = '';
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(term)
    );

    filteredProducts.forEach((product) => {
      const li = template.querySelector('li').cloneNode(true);
      li.querySelector('.item-image').src = product.image;
      li.querySelector('.item-title a').textContent = product.title;
      li.querySelector('.item-title a').href = `articulos.html?id=${product.id}`;
      li.querySelector('.item-description').textContent = product.description;
      li.querySelector('relative-time').textContent = new Date(product.date).toLocaleDateString();
      searchResults.appendChild(li);
    });
  }

  // inicializo y muestro todos los productos 
  fetchProducts().then(() => renderResults());
});


//funcion para pillar los productos de la api 
async function fetchProducts() {
  try { //obtengo datos de la api los guardo en una variable global y luego muestro lo q hay
    const response = await fetch(apiUrl); 
    allProducts = await response.json(); 
    displayProducts(allProducts); 
    initializeCategoryFilters(); 
    initializeSearch();
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
}


//renderizo los productos en el grid
function displayProducts(products) {
  const grid = document.getElementById('product-grid'); // contenedor del grid
  const template = document.getElementById('product-template'); 
  grid.innerHTML = ''; // limpio antes de añadir nuevos productos

  products.forEach((product) => {
    // clono plantilla
    const clone = template.content.cloneNode(true);

    // meto los datos del producto
    clone.querySelector('img').src = product.image;
    clone.querySelector('img').alt = product.title;
    clone.querySelector('.product-name').textContent = product.title;
    clone.querySelector('.product-description').textContent = product.short_description || product.description;
    clone.querySelector('.product-price').textContent = product.price;

    // enlance al articulo
    const link = clone.querySelector('.product-link');
    link.href = `articulos.html?id=${product.id}`;

    // Añadir el producto al grid
    grid.appendChild(clone);
  });

  // mostrar mensaje si no hay productos
  if (products.length === 0) {
    grid.innerHTML = '<p class="text-center text-gray-600">No se encontraron productos con estos filtros.</p>';
  }
}


function initializeCategoryFilters() {
  const categoryLinks = document.querySelectorAll('#popoverCategorias [popover] a');

  categoryLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      // obtengo el tipo y valor
      const filterType = link.closest('[popover]').previousElementSibling.textContent.trim().toLowerCase();
      const filterValue = link.textContent.trim().toLowerCase();

      // normalizo los nombres para cambiarlos
      const normalizedFilterType = {
        color: 'color',
        camera: 'camera',
        battery: 'flight_time',
        range: 'range',
      }[filterType] || filterType;

      // filtro por tipo y valor
      const filteredProducts = allProducts.filter((product) =>
        product.features.some(
          (feature) =>
            feature.type.toLowerCase() === normalizedFilterType && feature.value.toLowerCase() === filterValue
        )
      );

      //muestro los productos filtrados
      displayProducts(filteredProducts);
    });
  });
}



// Función para obtener el parámetro `id` de la URL
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// funcion para obtener los detalles de los productos
async function fetchProductDetails(productId) {
  try {
    const response = await fetch(`${apiUrl}/${productId}`);
    const product = await response.json();
    displayProductDetails(product);
  } catch (error) {
    console.error('Error al obtener el detalle del producto:', error);
  }
}

// funcion paramostrar detalles de los productos
function displayProductDetails(product) {
  const imageElement = document.getElementById('product-image');
  const nameElement = document.getElementById('product-name');
  const descriptionElement = document.getElementById('product-description');
  const priceElement = document.getElementById('product-price');
  const ratingElement = document.getElementById('product-rating');
  const tagsList = document.getElementById('product-tags');
  const featuresList = document.getElementById('product-features');

  // doy valores
  imageElement.src = product.image;
  imageElement.alt = product.title;
  nameElement.textContent = product.title;
  descriptionElement.textContent = product.description;
  priceElement.textContent = `Precio: ${product.price}`;
  ratingElement.textContent = product.rating || 'N/A';

  // etiquetas
  tagsList.innerHTML = '';
  if (product.tags && product.tags.length > 0) {
    product.tags.forEach((tag) => {
      const li = document.createElement('li');
      li.textContent = tag;
      tagsList.appendChild(li);
    });
  }
  // features
  featuresList.innerHTML = '';
  if (product.features && product.features.length > 0) {
    product.features.forEach((feature) => {
      const li = document.createElement('li');
      li.textContent = `${feature.type}: ${feature.value}`;
      featuresList.appendChild(li);
    });
  }
}


fetchProducts();

