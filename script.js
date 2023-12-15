//API CEP
document.querySelector('#button-cep').addEventListener('click', (evt) => {
    let cep = document.querySelector('#input-cep').value;
    console.log(cep);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            setEndereco(res);
            buscaPrevTemp(res.localidade);
            exibeNoticias(res.localidade);
        });
});

const setEndereco = (objEndereco) => {
    let divEndereco = document.querySelector('#endereco');
    let enderecoCompleto = `${objEndereco.logradouro}, ${objEndereco.bairro},
    ${objEndereco.localidade} - ${objEndereco.uf}`;
    let enderecoElement = document.createElement('p');
    enderecoElement.textContent = enderecoCompleto;
    divEndereco.innerHTML = '';
    divEndereco.appendChild(enderecoElement);
}

// API Previsão do Tempo
const buscaPrevTemp = (localidade) => {
    const apiKey = '4426f2c9e588f62885c98349af2f71dd';
    const apiUtl = `https://api.openweathermap.org/data/2.5/weather?q=${localidade}&units=metric&appid=${apiKey}&lang=pt_br`;
    fetch(apiUtl)
        .then((res) => res.json())
        .then((data) => {
            if (data.cod == '200') {
                exibePrevisaoTempo(data);
            } else {
                console.error('Erro na Busca de previsão do tempo', data.message);
            }
        })
        .catch((error) => {
            console.error('Erro na Busca da API', error);
        });
};

const exibePrevisaoTempo = (dados) => {
    let divPrevTemp = document.querySelector('#previsaotemp');
    let tempAtual = dados.main.temp;
    let tempMin = dados.main.temp_min;
    let tempMax = dados.main.temp_max;
    let descTempo = dados.weather[0].description;
    let prevElement = document.createElement('p');
    prevElement.textContent = `Temperatura Atual: ${tempAtual}°C, Condição:
    ${descTempo}, Temperatura Minima: ${tempMin}°C, Temperatura Maxima: ${tempMax}°C`;
    divPrevTemp.innerHTML = '';
    divPrevTemp.appendChild(prevElement);

    // API Mapa
    if (map === undefined) {
        map = L.map('map').setView([dados.coord.lat, dados.coord.lon], 15);
    } else {
        map.remove();
        map = L.map('map').setView([dados.coord.lat, dados.coord.lon], 15);
    }
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([dados.coord.lat, dados.coord.lon]).addTo(map)
        .bindPopup('Posição Atual')
        .openPopup();
};

let map;

// API Noticia
const buscaNoticia = (localidade) => {
    console.log(localidade);
    const apiNoticiasUrl = ` https://newsapi.org/v2/everything?q=brasil&from=2023-12-01&sortBy=popularity&language=pt&pageSize=4&apiKey=91aae96f34c24156aa07ff75fbcd1a35`;
    fetch(apiNoticiasUrl)
        .then((res) => res.json())
        .then((data) => {
            exibeNoticias(data.articles);
        })
        .catch((error) => {
            console.error('Erro na busca de notícias:', error);
        });
};

const buscaNoticias = (localidade) => {
    console.log(localidade);
    const apiNoticiasUrl = `https://newsapi.org/v2/everything?q=${localidade}&from=2023-12-01&sortBy=popularity&language=pt&pageSize=4&apiKey=91aae96f34c24156aa07ff75fbcd1a35`;
    fetch(apiNoticiasUrl)
        .then((res) => res.json())
        .then((data) => {
            exibeNoticias(data.articles);
        })
        .catch((error) => {
            console.error('Erro na busca de notícias:', error);
        });
};