let poemaCompleto = "cierro los ojos y camino tu anden de baldosas rotas la misma que piso aquí a mil kilómetros de tu quebrarse hay un árbol que conozco crece en todas las esquinas donde me detengo siempre es el mismo árbol siempre es otra sombra te recorro sin movimiento cada puerta que abro aquí abre allá cada umbral es todos los umbrales mi cuerpo en esta ciudad mis pasos en la bruma busco tu luz amarilla de las cinco de la tarde la encuentro en el reflejo de esta ventana ajena en el charco de esta lluvia que no es tuya que es tuya camino y caminas en mí eres el paso no el suelo a veces solo a veces coincidimos yo cerrando los ojos tú siendo recorrida en este presente que es memoria que es ahora que es nunca el lugar que habito el lugar que me habita sin estar no quiero volver ";

let rotationX = 0;
let rotationY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let radius = 250;
let caracteres = [];
let fontSize = 16;
let myFont;

function preload() {
    myFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textFont(myFont);
    crearTiraEspiral();
}

function crearTiraEspiral() {
    caracteres = [];
    let vueltasTotales = 20;
    let caracteresEnTira = vueltasTotales * 50;
    let tira = "";
    
    while (tira.length < caracteresEnTira) {
        tira += poemaCompleto;
    }
    
    for (let i = 0; i < tira.length; i++) {
        let t = i / tira.length;
        let theta = lerp(0.05, PI - 0.05, t);
        let phi = t * vueltasTotales * TWO_PI;
        let factorEspaciado = 1 / sin(theta);
        factorEspaciado = constrain(factorEspaciado, 1, 4);
        
        if (i % Math.floor(factorEspaciado) === 0) {
            let r = radius + sin(phi * 3) * 2;
            let x = r * sin(theta) * cos(phi);
            let y = r * cos(theta);
            let z = r * sin(theta) * sin(phi);
            
            caracteres.push({
                char: tira[i],
                x: x,
                y: y,
                z: z,
                theta: theta,
                phi: phi,
                progreso: t
            });
        }
    }
}

function draw() {
    background(25, 22, 20);
    ambientLight(140);
    directionalLight(255, 255, 255, 0.3, 0.3, -1);
    
    rotationX = lerp(rotationX, targetRotationX, 0.08);
    rotationY = lerp(rotationY, targetRotationY, 0.08);
    
    push();
    rotateX(rotationX);
    rotateY(rotationY);
    textFont(myFont);
    
    for (let i = 0; i < caracteres.length; i++) {
        let c = caracteres[i];
        
        push();
        translate(c.x, c.y, c.z);
        
        let vectorNormal = createVector(c.x, c.y, c.z);
        vectorNormal.normalize();
        let normalInvertida = p5.Vector.mult(vectorNormal, -1);
        let angleY = atan2(normalInvertida.x, normalInvertida.z);
        let angleX = asin(normalInvertida.y);
        
        rotateY(angleY);
        rotateX(angleX);
        
        let profundidad = c.z;
        let opacity = map(profundidad, -radius, radius, 180, 255);
        
        let anguloVista = (c.phi - rotationY) % TWO_PI;
        if (anguloVista < 0) anguloVista += TWO_PI;
        if (anguloVista > PI) anguloVista = TWO_PI - anguloVista;
        
        let brillo = map(anguloVista, 0, PI/2, 90, 75);
        let hue = map(c.progreso, 0, 1, 50, 55);
        let sat = map(profundidad, -radius, radius, 50, 80);
        
        fill(hue, sat, brillo, opacity);
        
        let escala = map(profundidad, -radius, radius, 0.9, 1.1);
        let escalaFoco = map(anguloVista, 0, PI/2, 1.2, 0.95);
        textSize(fontSize * escala * escalaFoco);
        
        textAlign(CENTER, CENTER);
        text(c.char, 0, 0);
        
        pop();
    }
    
    pop();
    
    if (!mouseIsPressed) {
        targetRotationY += 0.0005;
    }
}

function mouseDragged() {
    let sensibilidad = 0.006;
    targetRotationY = (mouseX - width/2) * sensibilidad;
    targetRotationX = (mouseY - height/2) * sensibilidad;
}

function mouseWheel(event) {
    radius -= event.delta * 0.2;
    radius = constrain(radius, 150, 400);
    crearTiraEspiral();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === 'r' || key === 'R') {
        rotationX = 0;
        rotationY = 0;
        targetRotationX = 0;
        targetRotationY = 0;
        radius = 250;
        crearTiraEspiral();
    }
    
    if (key === 'p' || key === 'P') {
        targetRotationY = (targetRotationY === 0) ? 0.0005 : 0;
    }
    
    if (key === '+' || key === '=') {
        fontSize = min(fontSize + 2, 30);
    }
    if (key === '-' || key === '_') {
        fontSize = max(fontSize - 2, 10);
    }
    
    if (keyCode === LEFT_ARROW) targetRotationY -= 0.05;
    if (keyCode === RIGHT_ARROW) targetRotationY += 0.05;
    if (keyCode === UP_ARROW) targetRotationX -= 0.05;
    if (keyCode === DOWN_ARROW) targetRotationX += 0.05;
}
