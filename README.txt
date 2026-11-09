ORGANIKANE WEBSITE
==================
Open index.html in a browser to view the site. No build step, no server needed.
To publish: upload the whole folder (index.html, css, js, fonts, images) to your hosting.

Where to change things
- Contact details, WhatsApp number ...... js/config.js
- Products (add / edit / remove) ........ js/products-data.js
- Product illustrations ................. js/art.js
- Real product photos ................... images/products/ + the `photo` field in products-data.js
- Text on the page ...................... index.html
- Colours, fonts, layout ................ css/style.css

Quote basket: visitors add products, set quantities and send the list to your WhatsApp
(0315-1232284) or by email. Nothing is stored on a server.

PHOTOS (added later)
--------------------
images/photos/      The full photos used in the hero, lookbook, scenes and printing section.
images/products/    One square photo per product (named after the product id).
To swap a photo: save the new file with the same name and replace the old one.
To add a photo to a product that still has an illustration (Plastic cutlery): save it in
images/products/ and add  photo:'images/products/<name>.webp', cover:true,  to that product in js/products-data.js.
Lookbook captions are in js/gallery.js (LOOK list). Scene tiles and printing cards are in the same file.
The original .jpg files you added to images/ are not used by the site, so you can keep them as backups or delete them.
