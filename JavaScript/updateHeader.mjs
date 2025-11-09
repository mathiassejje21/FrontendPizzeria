const path = window.location.pathname.toLowerCase();

let urlimg;
let text;

if (path.startsWith('/pizzeria')) {
  urlimg = '/public/images/logo-pizza.png';
  text = 'Pizzería Don Luigi';
} else {
  urlimg = '/public/images/logo-admin.png';
  text = 'Personal';
}

document.title = text;

let favicon = document.querySelector("link[rel~='icon']");

favicon.href = urlimg;
