const path = window.location.pathname.toLowerCase();

let urlimg;
let text;

if (path.startsWith('/pizzeria')) {
  urlimg = 'https://img.icons8.com/?size=100&id=503mbwCBW8xP&format=png&color=000000';
  text = 'Pizzería Don Luigi';
} else {
  urlimg = 'https://img.icons8.com/?size=100&id=97615&format=png&color=000000';
  text = 'Personal';
}

document.title = text;

let favicon = document.querySelector("link[rel~='icon']");

favicon.href = urlimg;
