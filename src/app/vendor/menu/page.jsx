
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { 
  RiAddLine, 
  RiPencilLine, 
  RiDeleteBinLine, 
  RiImageAddLine,
  RiRestaurantLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiInformationLine,
  RiShieldCheckLine,
  RiLightbulbFlashLine,
  RiStore2Line,
  RiPriceTag3Line
} from 'react-icons/ri';

export default function VendorMenu() {
  const { userId } = useAuth();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Fetch restaurant data first
        const restaurantRes = await fetch('/api/vendor/restaurant');
        const restaurantData = await restaurantRes.json();
        
        if (restaurantData.success) {
          setRestaurant(restaurantData.restaurant);
          
          // Then fetch menu items
          const menuRes = await fetch(`/api/vendor/menu`);
          const menuData = await menuRes.json();
          
          if (menuData.success) {
            setMenuItems(menuData.menuItems);
            
            // Extract unique categories
            const uniqueCategories = [...new Set(menuData.menuItems.map(item => item.category))];
            setCategories(uniqueCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMenuData();
    }
  }, [userId]);

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNewCategory = () => {
    if (newCategory.trim() === '') return;
    
    setCategories(prev => [...prev, newCategory.trim()]);
    setFormData(prev => ({ ...prev, category: newCategory.trim() }));
    setNewCategory('');
    setShowNewCategoryInput(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      isAvailable: true
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!restaurant) {
        showMessage('Restaurant not found. Please set up your restaurant first.', 'error');
        return;
      }

      // Validate form data
      if (!formData.name || !formData.price || !formData.category) {
        showMessage('Please fill in all required fields', 'error');
        return;
      }

      // Format price as a number
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        showMessage('Please enter a valid price', 'error');
        return;
      }

      const itemData = {
        ...formData,
        price,
        restaurantId: restaurant.id
      };

      let response;
      if (editingItem) {
        // Update existing item
        response = await fetch(`/api/vendor/menu/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itemData)
        });
      } else {
        // Create new item
        response = await fetch('/api/vendor/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itemData)
        });
      }

      const data = await response.json();

      if (data.success) {
        if (editingItem) {
          // Update item in state
          setMenuItems(prev => prev.map(item => 
            item.id === editingItem.id ? data.menuItem : item
          ));
        } else {
          // Add new item to state
          setMenuItems(prev => [...prev, data.menuItem]);
          
          // Add category if it's new
          if (!categories.includes(data.menuItem.category)) {
            setCategories(prev => [...prev, data.menuItem.category]);
          }
        }
        
        showMessage(
          editingItem ? 'Menu item updated successfully' : 'Menu item added successfully',
          'success'
        );
        setShowForm(false);
        resetForm();
      } else {
        showMessage(data.error || 'Error saving menu item', 'error');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      showMessage('An unexpected error occurred', 'error');
    }
  };

  const editItem = (item) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      isAvailable: item.isAvailable
    });
    setEditingItem(item);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const deleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/vendor/menu/${itemId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // Remove item from state
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
        showMessage('Menu item deleted successfully', 'success');
      } else {
        showMessage(data.error || 'Error deleting menu item', 'error');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      showMessage('An unexpected error occurred', 'error');
    }
  };

  const toggleItemAvailability = async (itemId, currentStatus) => {
    try {
      const response = await fetch(`/api/vendor/menu/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAvailable: !currentStatus })
      });

      const data = await response.json();

      if (data.success) {
        // Update item in state
        setMenuItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, isAvailable: !currentStatus } : item
        ));
      } else {
        showMessage(data.error || 'Error updating item availability', 'error');
      }
    } catch (error) {
      console.error('Error updating item availability:', error);
      showMessage('An unexpected error occurred', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If restaurant is not set up yet
  if (!restaurant) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto border border-stone-100">
        <div className="text-center">
          <RiStore2Line className="text-6xl text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-amber-900 mb-4">Restaurant Setup Required</h1>
          <p className="text-stone-600 mb-6">
            You need to set up your restaurant profile before managing your menu.
          </p>
          <button
            onClick={() => router.push('/vendor/settings')}
            className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-all duration-300 shadow-sm font-medium"
          >
            Set Up Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-amber-900 flex items-center">
          <RiRestaurantLine className="mr-3 text-amber-600" />
          Menu Management
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 shadow-sm font-medium ${
            showForm 
              ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              : 'bg-amber-700 text-white hover:bg-amber-800'
          }`}
        >
          {showForm ? (
            <>
              <RiCloseLine className="mr-2" />
              Cancel
            </>
          ) : (
            <>
              <RiAddLine className="mr-2" />
              Add Menu Item
            </>
          )}
        </button>
      </div>

      {/* Message notification */}
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <RiShieldCheckLine className="text-green-500 mr-2 text-xl" />
            ) : (
              <RiInformationLine className="text-red-500 mr-2 text-xl" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Add/Edit Menu Item Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-stone-100">
          <div className="flex items-center mb-4 pb-2 border-b border-stone-100">
            <RiRestaurantLine className="text-amber-600 mr-2" size={20} />
            <h2 className="text-lg font-serif text-amber-900">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Item Name */}
              <div>
                <label htmlFor="name" className="block text-stone-700 font-medium mb-2">
                  Item Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-stone-700 font-medium mb-2">
                  Price ($)*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-stone-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="pl-7 w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              {/* Description */}
              <label htmlFor="description" className="block text-stone-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Describe the dish, ingredients, etc."
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-stone-700 font-medium mb-2">
                  Category*
                </label>
                {showNewCategoryInput ? (
                  <div className="flex">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter new category"
                    />
                    <button
                      type="button"
                      onClick={handleNewCategory}
                      className="bg-green-600 text-white px-3 py-2 rounded-r-lg hover:bg-green-700 transition-all duration-300"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <div className="flex">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-stone-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryInput(true)}
                      className="bg-stone-100 text-stone-700 px-3 py-2 rounded-r-lg hover:bg-stone-200 transition-all duration-300"
                    >
                      New
                    </button>
                  </div>
                )}
              </div>
              
              {/* Availability */}
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 text-stone-700">
                  Item is available
                </label>
              </div>
            </div>
            
            {/* Image Upload (placeholder) */}
            {/* <div className="mb-6">
              <label className="block text-stone-700 font-medium mb-2">
                Item Image (Coming Soon)
              </label>
              <div className="border-2 border-dashed border-stone-200 rounded-lg p-8 flex flex-col items-center justify-center text-stone-500">
                <RiImageAddLine className="text-4xl mb-2 text-amber-300" />
                <p className="text-amber-900 font-medium">Image upload functionality coming soon</p>
              </div>
            </div> */}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all duration-300 shadow-sm"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tips section */}
      {!showForm && menuItems.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-start">
            <RiLightbulbFlashLine className="text-amber-600 mt-1 mr-3 text-xl" />
            <div>
              <h3 className="font-medium text-amber-900 mb-1">Menu Management Tips</h3>
              <p className="text-stone-700 text-sm">
                Group similar items into categories for better organization. Keep descriptions concise but informative, highlighting key ingredients and preparation methods.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Display */}
      {Object.keys(menuByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6 border border-stone-100">
              <h2 className="text-xl font-serif text-amber-900 mb-4 pb-2 border-b border-stone-100 flex items-center">
                <RiPriceTag3Line className="text-amber-500 mr-2" />
                {category}
              </h2>
              
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start py-3 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-all duration-200 rounded-md p-2">
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-lg text-stone-900">{item.name}</h3>
                        <p className="font-semibold text-amber-900">${item.price.toFixed(2)}</p>
                      </div>
                      {item.description && (
                        <p className="text-stone-600 mt-1">{item.description}</p>
                      )}
                      <div className="mt-2 flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.isAvailable 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => toggleItemAvailability(item.id, item.isAvailable)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          item.isAvailable 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                            : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                        }`}
                        title={item.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                      >
                        {item.isAvailable ? <RiCloseLine /> : <RiCheckboxCircleLine />}
                      </button>
                      <button
                        onClick={() => editItem(item)}
                        className="p-2 bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 transition-all duration-300 border border-amber-200"
                        title="Edit item"
                      >
                        <RiPencilLine />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-all duration-300 border border-red-200"
                        title="Delete item"
                      >
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-stone-100">
          <RiRestaurantLine className="text-6xl text-amber-300 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-amber-900 mb-2">Your menu is empty</h3>
          <p className="text-stone-600 mb-6">
            Start adding menu items to showcase your restaurant's offerings
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition-all duration-300 shadow-sm inline-flex items-center font-medium"
          >
            <RiAddLine className="mr-2" />
            Add Your First Menu Item
          </button>
        </div>
      )}
    </div>
  );
}