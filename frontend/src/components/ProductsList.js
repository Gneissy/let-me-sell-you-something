import React from "react";
import ProductsShow from "./ProductsShow";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ProductsList.css";
import axios from "axios";

function ProductsList() {

    const [products, setProducts] = useState([]);
    const [sort, setSort] = useState("");
    const [filters, setFilters] = useState({});
    const [filteredProducts, setFilteredProducts] = useState([]);

    // console.log(location.pathname.split("/")[2]); // Example:  localhost:3001/products/electronic  // log output: "electronic"
    const location = useLocation();
    const category = location.pathname.split("/")[2];

    const handleFilterChange = function(event) {
        // console.log(event.target.name); // output example: size
        // console.log(event.target.value); // output example: XXL
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        });
    };
    const handleSortChange = function(event) {
        setSort(event.target.value);
    }
    const getProducts = async function() {
        try {
          // Here if there is a category, takes that query. Otherwise directly takes all products.
          const response = await axios.get(
            category
              ? `http://localhost:3001/api/products?category=${category}`
              : "http://localhost:3001/api/products"
          );
          console.log(response.data);
          setProducts(response.data);
        } catch (err) {
          // error handling
        }
    }
    const renderedProducts = products.map(function(product) {
        return <ProductsShow product = { product } key = { product._id } />;
    });

    useEffect(() => {
      getProducts();
    }, [category]);

    useEffect(() => {
      // ! Here might (should) be if(category). 
      // TODO There is no category links in /product yet.

      // Only filter the products if a category is selected
        const filteredProducts = products.filter((item) => {
          // The filter method loops through each item in the products array.
          return Object.entries(filters).every(([key, value]) => {
            // For each item, it uses Object.entries(filters) to convert the filters object into an array of key-value pairs.
            // This allows iterating over the filters.

            // Check if the value is included in the item's property
            // If all key-value pairs satisfy the condition, the item is included in the filtered products.
            return item[key].includes(value);
          });
        });

        // Finally, set the filtered products
        setFilteredProducts(filteredProducts);
    }, [products, filters]);


    useEffect(() => {
      if (sort === "cheapest") {
        setFilteredProducts((prev) =>
          [...prev].sort((a, b) => a.price - b.price)
        );
      }
      else if (sort === "newest") {
        setFilteredProducts((prev) =>
          [...prev].sort((a, b) => a.createdAt - b.createdAt)
        );
      }
    }, [sort]);


    // console.log(filters); // Example output: {size: "L", color: "White"}
    // console.log(sort); // Example output: "popular"

    // Display "renderedProducts" which are many "ProductsShow" components
    // ********** Sorting cheapest needs changing to sth else and changing cheapest back, gonna check that **********

    return (
      <div className = "product-list-wrapper" >
        <div className = "product-list-selections" >
          <div className = "selection-filter" >
            <p className = "selection-title" > Filters: </p>
            <select name = "color" onChange = { handleFilterChange} >
              <option disabled selected > Color </option>
              <option > blue </option>
              <option > red </option>
              <option > green </option>
              <option > black </option>
              <option > white </option>
              <option > purple </option>
            </select>
            <select name = "size" onChange = { handleFilterChange } >
              <option disabled selected > Size </option>
              <option > xs </option>
              <option > s </option>
              <option > m </option>
              <option > l </option>
              <option > xl </option>
              <option > xxl </option>
            </select>
            </div>
            <div className = "selection-sort" >
              <p className = "selection-title" > Sorting: </p>
              <select onChange = { handleSortChange} >
                <option disabled selected > Sort </option>
                <option value = "cheapest" > cheapest </option>
                <option value = "newest" > newest </option>
              </select>
            </div>
          </div>
        <div className = "product-list" > {
          category
            ? filteredProducts.map((product) => <ProductsShow product={product} key={product._id} />)
            : renderedProducts
        }
        </div>
      </div>
    );
}

export default ProductsList;
