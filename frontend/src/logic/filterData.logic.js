const filterData = (data, selectedCategoria, searchQuery, stockRange) => {
        if (!data) return null;
        let filtered = data;
    
        if (selectedCategoria) {
        filtered = {
            ...filtered,
            productos: filtered.productos.filter(producto => producto.productoId.categoria === selectedCategoria),
        };
        }
    
        if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = {
            ...filtered,
            productos: filtered.productos.filter(producto =>
            Object.values(producto.productoId).some(value =>
                String(value).toLowerCase().includes(lowercasedQuery)
            )
            ),
        };
        }
    
        return {
        ...filtered,
        productos: filtered.productos.filter(producto => producto.cantidad >= stockRange[0] && producto.cantidad <= stockRange[1]),
        };
};

export default filterData;
