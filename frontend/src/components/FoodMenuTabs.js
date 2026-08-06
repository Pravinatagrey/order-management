import React, { useState } from 'react';
import './FoodMenuTabs.css';

const categories = [
  { id: "pizza", label: "🍕 Pizza" },
  { id: "burger", label: "🍔 Burger" },
  { id: "pasta", label: "🍝 Pasta" },
  { id: "drink", label: "🥤 Drinks" },
];

const FoodMenuTabs = ({ activeTab, onSelectTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen((prev) => !prev);
  const closeDrawer = () => setIsOpen(false);

  const handleSelect = (id) => {
    onSelectTab(id);
    closeDrawer();
  };

  return (
    <header className="food-menu-tabs-wrapper">
      {/* --- DESKTOP VIEW: Horizontal Tab Bar --- */}
      <div className="desktop-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tab-btn ${activeTab === cat.id ? "active" : ""}`}
            onClick={() => onSelectTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* --- MOBILE VIEW: Header Bar & Drawer --- */}
      <div className="mobile-header">
        <button className="menu-toggle-btn" onClick={toggleDrawer} aria-label="Open Menu">
          ☰
        </button>
        <span className="current-category">
          {categories.find((c) => c.id === activeTab)?.label || "Menu"}
        </span>
      </div>

      {/* Overlay Backdrop */}
      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={closeDrawer}
      />

      {/* Left Drawer Panel */}
      <aside className={`food-menu-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Select Category</h3>
          <button className="close-btn" onClick={closeDrawer} aria-label="Close Menu">
            ✕
          </button>
        </div>

        <nav className="drawer-menu-list">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`drawer-tab-btn ${activeTab === cat.id ? "active" : ""}`}
              onClick={() => handleSelect(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </aside>
    </header>
  );
};

export default FoodMenuTabs;