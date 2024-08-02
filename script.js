const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const arrowPauseBt = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('/sons/play.wav');
const audioPause = new Audio('/sons/pause.mp3')
const audioBeep = new Audio('/sons/beep.mp3')

let tempoDecorridoEmSegundos = 1500
let intervaloId = null

musica.loop = true;

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    }
    else {
        musica.pause();
    }
})

focoBt.addEventListener('click', () => {
    alterarContexto('foco');
    

})

curtoBt.addEventListener('click', () => {
    alterarContexto('descanso-curto');
   
})

longoBt.addEventListener('click', () => {
    alterarContexto('descanso-longo');

})

function alterarContexto(contexto) {
    
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa</strong>`;
            focoBt.classList.add('active');
            curtoBt.classList.remove('active');
            longoBt.classList.remove('active');
            tempoDecorridoEmSegundos = 1500
            break;
        case 'descanso-curto':
            titulo.innerHTML =  `Que tal dar uma respirada?<br> <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            curtoBt.classList.add('active'),
            focoBt.classList.remove('active');
            longoBt.classList.remove('active');
            tempoDecorridoEmSegundos = 300
            break;
        case 'descanso-longo':
            titulo.innerHTML =  `Hora de voltar à superfície. <br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            longoBt.classList.add('active');
            focoBt.classList.remove('active');
            curtoBt.classList.remove('active');
            tempoDecorridoEmSegundos = 900
            break;
        default:
            break;
    }
    mostrarTempo()
}

const contagemRegressiva = function() {
    if (tempoDecorridoEmSegundos <= 0) {
        //console.log('acabou');
        audioBeep.play()
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('focoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

function iniciarOuPausar(){
    if (intervaloId) {
        audioPause.play()
        zerar();
        return;
    }
    intervaloId = setInterval(contagemRegressiva, 1000);
    audioPlay.play();
    iniciarOuPausarBt.textContent = 'Pausar'
    arrowPauseBt.setAttribute('src', 'imagens/pause.png')
}
function zerar(){
    clearInterval(intervaloId);
    intervaloId = null;
    iniciarOuPausarBt.textContent = 'Começar'
    arrowPauseBt.setAttribute('src', 'imagens/play_arrow.png')
}
startPauseBt.addEventListener('click', iniciarOuPausar);

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()