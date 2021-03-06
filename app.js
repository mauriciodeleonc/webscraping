const express = require('express');
const app = express();

const axios = require('axios');
const cheerio = require('cheerio');
var connect = require('connect');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));


app.post('/', (req, res) => {
    const url = `https://pcel.com/index.php?route=product/search&filter_name=${req.body.producto}&filter_category_id=0&sort=p.price&order=${req.body.orden}&limit=${req.body.cant}`;
    console.log(req.body.orden);
    axios(url)
        .then(response => {
        const html = response.data;
        const $ = cheerio.load(html)
        const products = $('.product-list').find('tr');
        let pictures = [];
        let names = [];
        let prices = [];
        let links = [];
        let productList = [];
        for(var i = 0; i < products.length; i++){
            if($(products[i]).find('img').attr('src') === undefined) continue;
            pictures[i] = $(products[i]).find('img').attr('src');
            names[i] = $(products[i]).find('.name > a').text();
            prices[i] = $(products[i]).find('.price').text().split("\n");
            links[i] = $(products[i]).find('.name > a').attr('href');
            productList.push(
                {
                    picture: pictures[i],
                    name: names[i],
                    price: prices[i][1],
                    link: links[i]
                }
            );
            //console.log(productList);
        }
        res.send(
            `<!doctype html>
                <html lang="en">
                <head>
                    <!-- Required meta tags -->
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                
                    <!-- Bootstrap CSS -->
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
                
                    <title>Práctica Web scraping</title>
                </head>
                <body>
                    <div class='container'>
                        <div class='row' style="padding-top: 20px;">
                            <div class='col'>
                                <h1>Mi buscador de PCEL (De Mauricio y Jonathan)</h1>
                
                                <form class="needs-validation" action="http://localhost:3000" method="POST" novalidate>
                                    <div class="form-row">
                                        <div class="col-md-5 mb-3">
                                            <label for="producto">Producto a buscar (solamente una palabra)</label>
                                            <input type="text" class="form-control" id="producto" placeholder="Ej. Computadora" name="producto" required>
                                            <p id="product-hidden"></p>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="col-md-5 mb-3">
                                            <label for="cantidad">Cantidad de productos a mostrar</label>
                                            <input type="number" class="form-control" id="cantidad" placeholder="Ej. 20" min='1' max='20' name="cant" required>
                                            <p id="cantidad-hidden"></p>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class='col-md-5 mb-3'>
                                            <div class="form-check form-check-inline">
                                                <label for="cantidad">Orden</label>
                                                <input class="form-check-input ml-3" type="radio" id="ordenDesc" value="DESC" name="orden" checked>
                                                <label class="form-check-label mr-3" for="ordenDesc">Precio descendente</label>
                
                                                <input class="form-check-input" type="radio" id="ordenAsc" value="ASC" name="orden">
                                                <label class="form-check-label" for="ordenAsc">Precio ascendente</label>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary" type="submit">Buscar producto</button>
                                </form>
                            </div>
                        </div>
                
                        <div class='row' style="padding-top: 20px;">
                            <div class='col'>
                                <h1 id="titulo"></h1>
                                <div id='result-table'>
                                    <table class="table">
                                        <tbody>`
                                        +
                                        productList.map(product => {
                                            return(
                                                `<tr>
                                                    <td><img src="${product.picture}" /></td>
                                                    <td>${product.price}</td>
                                                    <td><a href="${product.link}" target="_blank"/>${product.name}</td>
                                                </tr>`
                                            );
                                        })
                                        +
                                        `
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <h3>Damos nuestra palabra que hemos trabajado en esta actividad con integirdad académica</h3>
                            </div>
                        </div>
                    </div>
                    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
                    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>'
                    <script>
                        let producto = document.getElementById('producto');
                        let cantidad = document.getElementById('cantidad');
                        (function() {
                            'use strict';
                            window.addEventListener('load', function() {
                            var forms = document.getElementsByClassName('needs-validation');
                            var validation = Array.prototype.filter.call(forms, function(form) {
                                form.addEventListener('submit', function(event) {
                                    if (form.checkValidity() === false || producto.value.includes(" ")) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }
                                    let productoHidden = document.getElementById('product-hidden');
                                    let cantidadHidden = document.getElementById('cantidad-hidden');
                                    if(producto.value.includes(" ")){
                                        producto.style.borderColor = "red";
                                        productoHidden.style.color = 'red';
                                        productoHidden.innerHTML = 'Por favor ingrese solo una palabra'
                                    } else {
                                        producto.style.borderColor = "green";
                                        productoHidden.style.color = 'green';
                                        productoHidden.innerHTML = 'Se ve bien!';
                                    }
                                    if(cantidad.value < 1 || cantidad.value > 20){
                                        cantidad.style.borderColor = "red";
                                        cantidadHidden.style.color = 'red';
                                        cantidadHidden.innerHTML = 'Por favor ingrese un número entre el 1 y 20'
                                    } else {
                                        cantidad.style.borderColor = "green";
                                        cantidadHidden.style.color = 'green';
                                        cantidadHidden.innerHTML = 'Se ve bien!';
                                    }
                                    //form.classList.add('was-validated');
                                }, false);
                                });
                            }, false);
                        })();
                    </script>
                    </body>
                </html>`)
        })
        .catch(console.error);
        
});

app.listen(3000, () => console.log('Gator app listening on port 3000!'));

