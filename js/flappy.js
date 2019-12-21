function novoElemento(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira');
    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');

    this.elemento.appendChild(reversa ? corpo : borda);
    this.elemento.appendChild(reversa ? borda : corpo);

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

function PardeBarreira(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true);
    this.inferior = new Barreira(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferior.elemento);

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturaInferior = altura - abertura - alturaSuperior;
        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturaInferior);
    }

    this.getx = () => parseInt(this.elemento.style.left.split('px')[0]);
    this.setx = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth;

    this.sortearAbertura();
    this.setx(x)
}


function Barreiras(altura, largura, abertura, espaco, noficarPonto) {
    this.pares = [
        new PardeBarreira(altura, abertura, largura),
        new PardeBarreira(altura, abertura, largura + espaco),
        new PardeBarreira(altura, abertura, largura + espaco * 2),
        new PardeBarreira(altura, abertura, largura + espaco * 3),
    ];

    const deslocamento = 3

    this.animar = () => {
        this.pares.forEach(par => {
            par.setx(par.getx() - deslocamento);

            //quando elemento sair da àrea do jogo
            if (par.getx() < -par.getLargura()) {
                par.setx(par.getx() + espaco * this.pares.length);
                par.sortearAbertura();
            }
            const meio = largura / 2;
            const cruzouMeio = par.getx() + deslocamento >= meio
                && par.getx() < meio
            if (cruzouMeio) noficarPonto();

        });
    }

}

function Passsaro(alturaJogo) {
    let voando = false;

    this.elemento = novoElemento('img', 'passaro');
    this.elemento.src = 'imgs/passaro.png'

    this.gety = () => parseInt(this.elemento.style.bottom.split('px')[0]);
    this.sety = y => this.elemento.style.bottom = `${y}px`;

    window.onkeydown = e => voando = true;
    window.onkeyup = e => voando = false;

    this.animar = () => {
        const novoY = this.gety() + (voando ? 8 : -5);
        const altuMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.sety(0)
        } else if (novoY >= altuMaxima) {
            this.sety(altuMaxima)
        } else {
            this.sety(novoY);
        }
    }

    this.sety(alturaJogo / 2);

}

function Progresso() {
    this.elemento = novoElemento('span', 'progresso');
    this.atulizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }

    this.atulizarPontos(0)

}

// const barreiras = new Barreiras(700, 1200, 300, 400);
// const passaro = new Passsaro(700)
// const areDojogo = document.querySelector('[wm-flappy]');
// areDojogo.appendChild(passaro.elemento)
// areDojogo.appendChild(new Progresso().elemento)
// barreiras.pares.forEach(par => areDojogo.appendChild(par.elemento))

// setInterval(() => {
//     passaro.animar();
//     barreiras.animar()
// }, 20);

// const b = new PardeBarreira(700,300,800);
// document.querySelector('[wm-flappy]').appendChild(b.elemento);

// const b = new Barreira(true)
// b.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function estaoSobrePosto(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect();
    const b = elementoB.getBoundingClientRect();

    const horizotal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizotal && vertical;
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parDeBarreira => {
        if (!colidiu) {
            const superior = parDeBarreira.superior.elemento
            const inferior = parDeBarreira.inferior.elemento
            colidiu = estaoSobrePosto(passaro.elemento, superior) || estaoSobrePosto(passaro.elemento, inferior)

        }
    })

    return colidiu

}

function TocarMusica() {
    var audio1 = new Audio();
    audio1.src = "music/away-flappy-bird-gameplay.mp3";
    audio1.play();
}

function FlappyBird() {
    let pontos = 0;

    const areaDojogo = document.querySelector('[wm-flappy]');
    const altura = areaDojogo.clientHeight;
    const largura = areaDojogo.clientWidth;

    const progresso = new Progresso();
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => progresso.atulizarPontos(++pontos));
    const passaro = new Passsaro(altura);

    areaDojogo.appendChild(progresso.elemento);
    areaDojogo.appendChild(passaro.elemento);
    barreiras.pares.forEach(par => areaDojogo.appendChild(par.elemento));

    this.start = () => {

        const temporizador = setInterval(() => {
            barreiras.animar();
            passaro.animar();

            new TocarMusica();

            if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador);

            }
        }, 20);
    }

}

new FlappyBird().start();
