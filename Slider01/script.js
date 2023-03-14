var UIComponent = UIComponent || {};

UIComponent.Slider = function(el, options){
  var self = this;
  var slide_container = null;
  var slides = null;
  var slider_nav = null;
  var prev_button = null;
  var next_button = null;
  var current_step = 0;
  var item_width = null;
  var item_per_step = null;
  var steps = null;

  var defaults = {
    autoplay: false,
    items: 1,
    createNav: true,
    resoponsive: false,
    mobile: {
      items: 2
    },
    tablet: {
      items: 3
    },
    desktop: {
      items: 4
    }
  }

  function create_nav(){
    slider_nav = document.createElement('ul');
    slider_nav.classList.add('slider__nav');
    create_nav_links();
    el.append(slider_nav);
  }

  function getIndex(element){
    var nodes = element.parentNode.childNodes;

    for (var i=0; i < nodes.length; i++){
      if(nodes[i] == element){
        return i;
      }
    }
    
  }

  function create_nav_links(){
    var navArray = [];
    for(var i=0; i<steps;i++){
      // console.log(steps)
      var li = document.createElement('li');
      var nav_link = document.createElement('a');
      nav_link.setAttribute('href', '#');
      navArray.push(nav_link);

      nav_link.addEventListener('click', function(e){
        e.preventDefault();
        
        var index = getIndex(this.parentElement);
        moveTo(index);
        // active_nav_links(index);
      });

      li.append(nav_link);
      slider_nav.append(li);
    }
    // navArray[0].classList.add('active');
  }

  function active_nav_links(idx){
    var slider_nav = el.querySelector('.slider__nav');
    var nav_links = slider_nav.querySelectorAll('a');
    nav_links.forEach(function(nav_link, i){
      nav_link.classList.remove('active');
      if(idx == i){
        nav_link.classList.add('active');
      }
    });
  }

  function get_slides_to_move(step){
    // back
    if(step < current_step){
      if(step == step - 2){
        var slide_total = slides.length;
        var slides_left = (slides.length - step * item_per_step);  //1
        var slides_to_move = slide_total - slides_left;  //3
        return slides_to_move;
      }else{
        return step * item_per_step;
      }
    }
    // forward
    if(step > current_step){
      if(step == steps - 1){
        var previous_step_slide_total = (step - 1) * item_per_step;  //2
        var slides_left = (slides.length - step * item_per_step);  //1
        var slides_to_move = previous_step_slide_total + slides_left;  //3
        return slides_to_move;
      }else{
        return step * item_per_step;
      }
    }
  }

  function setItem(count){
    slide_container.style.transform = 'translateX(0px)';
    item_per_step = count;
    steps = Math.ceil(slides.length / item_per_step);
    
    if(item_per_step > 1){
      var slide_width = 100 / item_per_step;
      for(var i=0;i<slides.length;i++){
        var slide = slides[i];
        if(slide){
          slide.style.width = slide_width + '%';
        }
      }
      }else{
        for(var i=0;i<slides.length;i++){
          var slide = slides[i];
          if(slide){
            slide.style.removeProperty('width');
          }
      }
    }
  }

  function moveBack(){
    if(current_step <= 0) {
      return false;
    }
    moveTo(current_step - 1);
  }

  function moveForward(){
    if(current_step >= steps - 1) {
      return false;
    }
    moveTo(current_step + 1);
  }

  function moveTo(step){

    var percentage = 100 / item_per_step;
    var x = item_per_step > 1 ? percentage * get_slides_to_move(step) : step * percentage;
    slide_container.style.transition = '1s';
    slide_container.style.transform = 'translateX(-' + x + '%)';
    current_step = step;

    update_buttons();
  }

  function update_buttons(){
    if(prev_button){
      if(current_step <= 0){
        prev_button.classList.add('hidden');
      }else{
        prev_button.classList.remove('hidden');
      }
    }

    if(next_button){
      if(current_step >= steps - 1){
        next_button.classList.add('hidden');
      }else{
        next_button.classList.remove('hidden');
      }
    }

    //nav
    if(options.createNav){
      var current_nav = slider_nav.querySelectorAll('a')[current_step];
      var active = slider_nav.querySelector('a.active');
      if(active){
        active.classList.remove('active');
      }
      current_nav.classList.add('active');
    }
  }

  function init(){
    options = Object.assign(defaults, options || {});
    
    slide_container = el.querySelector('.slider__slides');
    slides = el.querySelectorAll('.slider__slide');
    prev_button = el.querySelector('.slider__button--prev');
    next_button = el.querySelector('.slider__button--next');
    item_width = slides[0].offsetWidth;
    
    // responsive
    if(options.resoponsive){

    }else{
      setItem(options.items);  
    }

    // create nav
    if(options.createNav){
      create_nav();
    }

    // next button
    if(next_button){
      next_button.addEventListener('click',function(e){
        e.preventDefault();
        moveForward();
      });
    }

    // prev button
    if(prev_button){
      prev_button.addEventListener('click',function(e){
        e.preventDefault();
        moveBack();
      });
    }
    
    update_buttons();
    // setItem();
  }

  init();

}