'use strict';

// Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height; //getBoundingClientRect는 주어진 값보다 실제 client가 보는 위치로 가져옴

document.addEventListener('scroll', () => {
  //   console.log(window.scrollY);
  //   console.log(`nabarHeight: ${navbarHeight}`);

  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
  }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link; // html에서 data- 뒤에 적은 내용이 link여서 그것의 value를 가져옴
  if (link == null) {
    return;
  }

  //   console.log(event.target.dataset.link); //dataset is that I gave in html attribute like data-link
  navbarMenu.classList.remove('open'); // 반응형일때 클릭을 하면 항상 메뉴창이 없어지도록 하기 위해
  scrollIntoViews(link);
  selectNavItem(target);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
});

// Handle click on "contact me" button on home
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
  scrollIntoViews('#contact');
});

// Make home slowly fade to tranparent as the window scrolls down
const home = document.querySelector('.home__container'); // not #home bc fading only for the content not including background
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  // console.log(1 - window.scrollY / homeHeight);
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible'); // add class name
  } else {
    arrowUp.classList.remove('visible');
  }
});

// Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
  scrollIntoViews('#home');
});

// Projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project'); // array
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter; // span is inside of a tag so, if the number of projects is clicked(undefined), get the parentsNode's dataset filter
  // console.log(filter);
  if (filter == null) {
    return;
  }

  // Remove selection from the previous item and select the new one
  const active = document.querySelector('.category__btn.selected');
  active.classList.remove('selected');
  const target =
    e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode; // span(number)를 누르면 거기에 selected가 되서 에러남.
  target.classList.add('selected'); // 그럼 여기서는 버튼만 선택이됨..

  projectContainer.classList.add('anim-out');

  setTimeout(() => {
    // same as 'for(let project of projects)';
    projects.forEach((project) => {
      // console.log(project.dataset.type);
      if (filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    });
    projectContainer.classList.remove('anim-out');
  }, 300);
});

// 1. 모든 section 요소들과 menu item들을 가지고 온다
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다
const sectionIds = [
  '#home',
  '#about',
  '#skills',
  '#work',
  '#testimonials',
  '#contact',
];

const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);
// console.log(sections);
// console.log(navItems);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

// utility functions
function scrollIntoViews(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null, // viewport
  rootMargin: '0px',
  threshold: 0.3, //30%가 window에 보일경우 실행
};
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      //처음렌더링시 testimonial이 selected가 되있어서 해결하려고
      // console.log(entry);
      // !니까 나가는 요소
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // console.log(index, entry.target.id);

      if (entry.boundingClientRect.y < 0) {
        // 마이너스 일경우->스크롤링이 아래로 되어서 페이지가 올라옴
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

window.addEventListener('wheel', () => {
  //wheel은 사용자가 직접 스크롤링을 할 경우
  if (window.scrollY == 0) {
    // 스크롤이 맨위에 있을 때 -> Home
    selectedNavIndex = 0;
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight //scrollY와 window창의 innerHeight 값을 더한값이 정확하게 일치 하지 않는 경우가 있음. 소수점이 나올수 있기때문
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});
