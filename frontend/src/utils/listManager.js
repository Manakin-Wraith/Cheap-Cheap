// List management utility functions
const generateListId = () => {
  return `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createNewList = (name, items) => {
  const listId = generateListId();
  const list = {
    id: listId,
    name: name,
    items: items,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    retailer: 'pnp'
  };
  
  localStorage.setItem(listId, JSON.stringify(list));
  return list;
};

export const getAllLists = () => {
  const lists = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      const list = JSON.parse(localStorage.getItem(key));
      if (list && list.id && list.name && Array.isArray(list.items)) {
        lists.push(list);
      }
    } catch (e) {
      console.warn(`Failed to parse list: ${key}`);
    }
  }
  return lists.sort((a, b) => b.updatedAt - a.updatedAt);
};

export const getListById = (listId) => {
  try {
    return JSON.parse(localStorage.getItem(listId));
  } catch (e) {
    console.error(`Failed to get list: ${listId}`);
    return null;
  }
};

export const updateList = (listId, updates) => {
  const list = getListById(listId);
  if (!list) return null;

  const updatedList = {
    ...list,
    ...updates,
    updatedAt: Date.now()
  };
  
  localStorage.setItem(listId, JSON.stringify(updatedList));
  return updatedList;
};

export const deleteList = (listId) => {
  localStorage.removeItem(listId);
};

export const duplicateList = (listId) => {
  const list = getListById(listId);
  if (!list) return null;

  return createNewList(`${list.name} (Copy)`, list.items);
};

export const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => {
    return total + (parseFloat(item.currentPrice.replace('R', '')) * item.quantity);
  }, 0);
};

export const calculateTotalSavings = (items) => {
  return items.reduce((total, item) => {
    const currentPrice = parseFloat(item.currentPrice.replace('R', ''));
    const oldPrice = item.originalProduct.old 
      ? parseFloat(item.originalProduct.old.replace('R', ''))
      : currentPrice;
    const savings = (oldPrice - currentPrice) * item.quantity;
    return total + (savings > 0 ? savings : 0);
  }, 0);
};
