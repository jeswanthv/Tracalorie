//Storage Controller
const StorageCtrl = (function(){
    //Public methods
    return{
        storeItem:function(item){
            let items ;
            //Check if any items in ls
            if(localStorage.getItem('items') === null){
                items = [];
                //Push new item
                items.push(item);
                //Set ls
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                items = JSON.parse(localStorage.getItem('items'));

                //PUsh new Item
                items.push(item);

                //Reset ls
                localStorage.setItem('items', JSON.stringify(items));
            }

        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

//Item Controller
const ItemCtrl = (function(){
    //Item Constructor
    const Item = function(id, name, calories) {
        this.id = id,
        this.name = name,
        this.calories = calories;
    }

    //Data Structure/State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return{
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            //Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else{
                ID = 0;
            }

            //Calories to number
            calories = parseInt(calories);

            //Create new Item
            newItem = new Item(ID, name, calories);

            //Add to items array
            data.items.push(newItem);

            return newItem
        },
        getItemById: function(id){
            let found = null;
            //Loop through item
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            //calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            //get id's
            const ids = data.items.map(function(item){
                return item.id
            });

            //Get index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = []
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            //Loop through items and add cals
            data.items.forEach(function(item){
                total += item.calories;
            })

            //Assign total to totalcalories
            data.totalCalories = total;

            //return
            return data.totalCalories;
        },

        logData: function(){
            return data;
        }
    }
    
})();


//UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        clearBtn: '.clear-btn'
    }

    //Public fn.
    return{
        populateItemList: function(items){
            let html = '';
            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                        </li>`
            });

            //Insert items into html
            document.querySelector(UISelectors.itemList).innerHTML = html;

        },
        getItemEvent: function(){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value

            }
            
        },
        addListItem: function(item){
            //Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //Add ID
            li.id = `item-${item.id}`,
            //add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            })
        },
        deleteListItem:function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            })
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(total){
            document.querySelector(UISelectors.totalCalories).textContent = total;

        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        
        getSelectors: function(){
            return UISelectors;
        }
    }
    
})();


//App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //Load All Event listeners
    const loadEventListeners = function(){
        //get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    
        //Disable subit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false; 
            }
        })

        //Edit icon click Event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        
        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Back item event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }
    //itemAddEvent fn.
    const itemAddSubmit = function(e){
        //get input
        const input = UICtrl.getItemEvent();

        //Check for empty strings
        if(input.name !== '' && input.calories !== ''){
            //Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //Add Item to UI list 
            UICtrl.addListItem(newItem);

            //Get Total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add totalcalories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in localstorage
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();

        }
       

        e.preventDefault();
    }

    //Update item Submit
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //get list item id
            const listId = e.target.parentNode.parentNode.id;
            
            //Break into an array
            const listIdArr = listId.split('-');

            //Get the actual id
            const id = parseInt(listIdArr[1]);

            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();

        }

        e.preventDefault()
    }

    //update item submit
    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemEvent();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI List Item
        UICtrl.updateListItem(updatedItem);

        //Get Total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add totalcalories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();
        
        e.preventDefault();
    }

    //Delete item submit
    const itemDeleteSubmit = function(e){
        
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from Ds
        ItemCtrl.deleteItem(currentItem);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get Total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add totalcalories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from localstorage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();    

        e.preventDefault();
    }

    //Clear items event
    const clearAllItemsClick = function(){
        //Delete all items from ds
        ItemCtrl.clearAllItems(); 

        //Get Total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add totalcalories to UI
        UICtrl.showTotalCalories(totalCalories);

        //remove from UI
        UICtrl.removeItems();

        //Clear from ls
        StorageCtrl.clearItemsFromStorage(); 

        //Hide UL
        UICtrl.hideList();
    }

    return{
        init: function(){
            //clear edit state
            UICtrl.clearEditState();

            //Fetch data from datastructures
            const items = ItemCtrl.getItems();

            //Check id any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //Populate List with items
                UICtrl.populateItemList(items);

            }

            //Get Total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add totalcalories to UI
            UICtrl.showTotalCalories(totalCalories);

            //LoadEventHandler
            loadEventListeners()

        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize App
App.init();