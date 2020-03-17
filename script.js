document.addEventListener("DOMContentLoaded", function(){
  
 let lists = document.querySelectorAll('.arrow'),
     baskets = document.querySelectorAll('.basket'),
     orderForm = document.querySelector('.order'),
     images = {
        'yellow' : 'images/s-fizzy-yellow.png',
        'red' : 'images/s-fizzy-red.png',
        'purple' : 'images/s-fizzy-purple.png',
        'green' : 'images/s-fizzy-green.png'
      },
     orders = document.querySelectorAll('.quantity'),
     forClone = document.querySelector('.order-form'),
     all = document.querySelector('.all'),
     backArrow = document.querySelector('.back-arrow');
     

     for(let arrow of lists){
         arrow.addEventListener('click', showDropMenu)
     }

     for(let basket of baskets){
         basket.addEventListener('click', showBasket)
     }
     backArrow.addEventListener('click', hideBasket);


     function showDropMenu(event){
            event.target.style.transform = 'rotateX(180deg)';
        let parent = event.target.parentNode;
        let list = getList();
            list.classList.add('drop-list');
            list.dataset.type = `${event.target.dataset.type}`;
            list.style.left = `${parent.offsetLeft - 38}px`;
            list.style.top = `${parent.offsetTop + parent.offsetHeight}px`;
        document.querySelector('.prices').append(list);

        for(let item of list.children){
            item.addEventListener('click', selectQuantity);
        }

        event.target.removeEventListener('click', showDropMenu);
        event.target.addEventListener('click', hideDropMenu);
        
     }

     function selectQuantity(event){
      let type = event.target.parentNode.dataset.type;
          [].slice.call(document.querySelectorAll('.quantity')).forEach((elem)=>{
              let color = elem.getAttribute('color');
              if(color == type){
                  elem.innerHTML = event.target.innerHTML;
                  event.target.parentNode.remove();
                  elem.nextElementSibling.style.transform = 'rotateX(0deg)';
                  elem.nextElementSibling.addEventListener('click', showDropMenu);
              }
          })
     }

     function hideDropMenu(event){
        event.target.style.transform = 'rotateX(0deg)';
        for(let list of document.querySelectorAll('.drop-list')){
            if(event.target.dataset.type == list.dataset.type){
                list.remove();
            }
        }
        event.target.removeEventListener('click', hideDropMenu);
        event.target.addEventListener('click', showDropMenu);
        
     }

     function getList(){
         let ul = document.createElement('ul');

         for( let i = 0; i < 50; i++){
            let li = document.createElement('li');
            li.innerHTML = `${i + 1}`;
            li.classList.add('number');
            ul.append(li);
         }
         return ul;
     }


     function showBasket(){
         let preview = document.querySelector('.for_preview');

         preview.classList.add('preview');
         orderForm.classList.add('order-active');

        let objects = [];
        let created = document.querySelectorAll('.active');

        Array.from(orders).forEach((order)=>{

          if(checkElem(created, order)){
             return;
          }
           else{
            let  clone = forClone.cloneNode(true),
            imgSrc = clone.querySelector('img'),
            quantity = clone.querySelector('.qta'),
            summ = clone.querySelector('.good-summ');

            if(Number(order.innerHTML) > 0){
                let color = order.getAttribute('color');
                imgSrc.src = images[color];
                quantity.innerHTML = +(order.innerHTML);

                let cost = +(order.parentNode.parentNode.previousElementSibling.getAttribute('cost'));
                summ.innerHTML = +(cost);
                clone.classList.add('active');
                clone.setAttribute('color', color);
                objects.push(clone);
              }   
           }   
         })
        
        let insertPlace = document.querySelector('.for-items');
            
            for(let elem of objects){
                insertPlace.append(elem);
                elem.insertAdjacentHTML('afterend','<hr class="line"></hr>');
            }
            getTotalSum();

        let plus = document.querySelectorAll('.plus');
        let minus = document.querySelectorAll('.minus');
        let del = document.querySelectorAll('.delete');
            
        for(let item of plus){
            item.addEventListener('click', addPosition);
        }
        for(let elem of minus){
            elem.addEventListener('click', minusPosition);
        }
        for(let elem of del){
            elem.addEventListener('click', deleteItem);
        }

        preview.addEventListener('click', hidePreview);
    
     }


     function checkElem(array, order){
         for(let elem of array){
             let currentGood = order.getAttribute('color');
             let existGood = elem.getAttribute('color');
             if(currentGood == existGood){
                let currentValue = order.innerHTML;
                let previousValue = elem.querySelector('.qta');
                previousValue.innerHTML = currentValue;
                getTotalSum();
                return true;
             }
         }
     }


     function hideBasket(){
        orderForm.classList.remove('order-active');
        document.querySelector('.for_preview').classList.remove('preview');
     }
     function hidePreview(event){
        let [targetOne, targetTwo] = match(event);
        if(targetOne || targetTwo){
            return;
        }
         
       event.target.classList.remove('preview');
       orderForm.classList.remove('order-active');
     }


     function match(aim){
        return [aim.target.closest('.order'), aim.target.closest('.delete')];
     }


     function addPosition(event){
        let currentQuantity = event.target.closest('.order-form');
        let currentValue = currentQuantity.querySelector('.qta');
            currentValue.innerHTML = `${+(currentValue.innerHTML) + 1}`;
            getTotalSum();

     }


     function minusPosition(event){
        let currentQuantity = event.target.closest('.order-form');
        let currentValue = currentQuantity.querySelector('.qta');
        if(+(currentValue.innerHTML) == 0){
            return;
        }
            currentValue.innerHTML = `${+(currentValue.innerHTML) - 1}`;
            getTotalSum();
     }


     function getTotalSum(){
         let totalSum = 0;
         let orderedItems = document.querySelectorAll('.for-items .active');

         if(orderedItems.length == 0){
            all.innerHTML = 0;
            return;
         }
         Array.from(orderedItems).forEach((item)=>{
            let qta = item.querySelector('.qta').innerHTML;
            let sum = item.querySelector('.good-summ').innerHTML;
            totalSum += (+qta) * (+sum);
           
            all.innerHTML = totalSum;
         })
     }


     function deleteItem(event){
       let item = event.target.parentNode;
           item.nextSibling.remove();
           item.remove();
           getTotalSum();
           
     }


})