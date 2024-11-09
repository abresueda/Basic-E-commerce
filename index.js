let selectedProductId = null;

function openEditModal(productId, title, description, price) {
    selectedProductId = productId;
    document.getElementById("editTitle").value = title;
    document.getElementById("editDescription").value = description;
    document.getElementById("editPrice").value = price;
    document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

function openDeleteModal(productId) {
    selectedProductId = productId;
    document.getElementById("deleteModal").style.display = "flex";
}

function saveEdit() {
    const title = document.getElementById("editTitle").value;
    const description = document.getElementById("editDescription").value;
    const price = document.getElementById("editPrice").value;

    const productCard = document.querySelector(`.product-card[data-id="${selectedProductId}"]`);

    if (productCard) {
        productCard.querySelector("h2").innerText = title;
        productCard.querySelector("p.description").innerText = description;
        productCard.querySelector("p.price").innerText = `$${price}`;
    }
    
    closeEditModal();   
}

function confirmDelete() {
    const productCard = document.querySelector(`.product-card[data-id="${selectedProductId}"]`);
    if (productCard) {
        productCard.remove();
    }

    closeDeleteModal();
    console.log(`Deleted product ID: ${selectedProductId}`);
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

const fetchProducts = async () => {
    try {
        const res = await fetch('https://fakestoreapi.com/products/');
        const data = await res.json();
        products = data;
        displayProducts(data);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

const displayProducts = (products) => {
    const productContainer = document.getElementById("productContainer");
    const loading = document.getElementById("loading");
    loading.style.display = "none";
    productContainer.style.display = "grid";

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-id", product.id);

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p class="description">${product.description}</p>
            <p class="price">$${product.price}</p>
            <button onclick="openEditModal(${product.id}, '${product.title.replace(/'/g, "\\'")}', '${product.description.replace(/'/g, "\\'")}', ${product.price})">Edit</button>
            <button onclick="openDeleteModal(${product.id})">Delete</button>
        `;

        productContainer.appendChild(productCard);
    });
};

fetchProducts();

//Filter Function
const displayProduct = (productsToDisplay) => {
    productContainer.innerHTML = ''; // Her renderda önceki ürünleri temizle
    productsToDisplay.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p class="description">${product.description}</p>
            <p class="price">$${product.price}</p>
            <button onclick="openEditModal()">Edit</button>
            <button onclick="openDeleteModal()">Delete</button>
        `;
        productContainer.appendChild(productCard);
    });
};

const filterForm = document.getElementById("filterForm");
const productContainer = document.getElementById("productContainer");

filterForm.addEventListener("change", applyFilters);

let products = []; // Burada, API'den çekilen ürünleri tutacağız

function applyFilters() {
    const gender = document.getElementById("gender").value;
    const category = document.getElementById("category").value;
    const priceRange = document.getElementById("priceRange").value;

    // Filtrelenmiş ürünleri almak için
    let filteredProducts = products;

    // Cinsiyet filtresi
    if (gender) {
        filteredProducts = filteredProducts.filter(product => product.gender === gender);
    }

    // Kategori filtresi
    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Fiyat aralığı filtresi
    if (priceRange) {
        const [min, max] = priceRange.split('-');
        filteredProducts = filteredProducts.filter(product => {
            const price = product.price;
            if (max) {
                return price >= min && price <= max;
            } else {
                return price >= min;
            }
        });
    }

    // Filtrelenmiş ürünleri görüntüle
    displayProduct(filteredProducts);
}

