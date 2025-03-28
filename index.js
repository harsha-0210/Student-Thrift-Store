import React from "react";
import ReactDOM from "react-dom";
import ThriftStore from "./App.js";
import "./styles.css";

ReactDOM.render(<ThriftStore />, document.getElementById("root"));

/* App.js */
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function ThriftStore() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", image: "" });

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchItems();
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const addItem = async () => {
    await addDoc(collection(db, "items"), newItem);
    setNewItem({ name: "", price: "", image: "" });
  };

  return (
    <div className="container">
      <h1>Student Thrift Store</h1>
      <div className="grid">
        {items.map((item) => (
          <div key={item.id} className="card">
            <img src={item.image} alt={item.name} className="image" />
            <h2>{item.name}</h2>
            <p>₹{item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="cart">
        <h2>Cart</h2>
        {cart.length === 0 ? <p>No items in cart</p> : cart.map((item, index) => (
          <div key={index} className="cart-item">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>
      <div className="add-item">
        <h2>Add New Item</h2>
        <input type="text" placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
        <input type="text" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
        <input type="text" placeholder="Image URL" value={newItem.image} onChange={(e) => setNewItem({ ...newItem, image: e.target.value })} />
        <button onClick={addItem}>Add Item</button>
      </div>
    </div>
  );
}
