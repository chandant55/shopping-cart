import React, { createContext, useContext, useReducer } from "react";
import { faker } from "@faker-js/faker";
import { cartReducer } from "./Reducers";

function getRandomElementFromArray(arr) {
  if (arr.length === 0) {
    return null; // Return null if the array is empty
  }

  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const Cart = createContext({});
faker.seed(99);

const Context = ({ children }) => {
  const products = [...Array(20)].map((element, index) => ({
    id: crypto.randomUUID(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    image: `https://picsum.photos/id/${index + 50}/300/200`,
    inStock: getRandomElementFromArray([0, 3, 5, 6, 7]),
    fastDelivery: faker.datatype.boolean(),
    ratings: getRandomElementFromArray([1, 2, 3, 4, 5]),
  }));

  const [state, dispatch] = useReducer(cartReducer, {
    products: products,
    cart: [],
  });

  const [productState, productDispatch] = useReducer(productReducer, {
    byStock: false,
    byFastDelivery: false,
    byRating: 0,
    searchQuery: "",
  });

  return (
    <Cart.Provider value={{ state, dispatch, productState, productDispatch }}>
      {children}
    </Cart.Provider>
  );
};

export default Context;

export const CartState = () => {
  return useContext(Cart);
};

export const productReducer = (state, action) => {
  switch (action.type) {
    case "SORT_BY_PRICE":
      return { ...state, sort: action.payload };

    case "FILTER_BY_STOCK":
      return { ...state, byStock: !state.byStock };

    case "FILTER_BY_DELIVERY":
      return { ...state, byFastDelivery: !state.byFastDelivery };

    case "FILTER_BY_RATING":
      return { ...state, byRating: action.payload };

    case "FILTER_BY_SEARCH":
      return { ...state, searchQuery: action.payload };

    case "CLEAR_FILTERS":
      return {
        byStock: false,
        byFastDelivery: false,
        byRating: 0,
        searchQuery: "",
      };

    default:
      return state;
  }
};
