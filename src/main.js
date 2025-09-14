import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
document.body.appendChild(renderer.domElement);

// Add lights (aumenta intensità e aggiungi altre luci)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // intensità aumentata
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // intensità aumentata
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Aggiungi una seconda luce direzionale opposta
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight2.position.set(-5, 5, -5);
scene.add(directionalLight2);

// Aggiungi una luce puntiforme sopra l’avatar
const pointLight = new THREE.PointLight(0xffffff, 1.2, 50);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);

// Load GLB model (gamma.glb)
const loader = new GLTFLoader();
let model;
let mixer;
let gltfAnimations = [];

loader.load(
    'importante_test6.glb',
    (gltf) => {
        model = gltf.scene;
        scene.add(model);

        model.position.set(0, 0, 0);
        model.scale.set(3, 3, 3);

        model.traverse((child) => {
            if (child.isMesh && child.material && child.material.color) {
                child.material.color.lerp(new THREE.Color(0xffffff), 0.5);
                child.material.needsUpdate = true;
            }
        });

        gltfAnimations = gltf.animations;
        mixer = new THREE.AnimationMixer(model);

        // Avvia animazione neutra all'avvio
        const neutralAnim = gltfAnimations.find(a => a.name.toLowerCase() === 'neutra');
        if (neutralAnim) {
            const neutralAction = mixer.clipAction(neutralAnim);
            neutralAction.reset();
            neutralAction.setLoop(THREE.LoopRepeat);
            neutralAction.play();
        }
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('Error loading model', error);
    }
);

// Crea il pulsante microfono 
const micBtn = document.createElement('button');
micBtn.innerHTML = '<span style="font-size:48px;">🎤</span>';
micBtn.style.position = 'absolute';
micBtn.style.left = '5%'; // Sinistra dello schermo
micBtn.style.top = '50%';
micBtn.style.transform = 'translateY(-50%)';
micBtn.style.width = '90px';
micBtn.style.height = '90px';
micBtn.style.borderRadius = '50%';
micBtn.style.background = '#4285f4';
micBtn.style.color = '#fff';
micBtn.style.border = 'none';
micBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
micBtn.style.cursor = 'pointer';
micBtn.style.display = 'flex';
micBtn.style.alignItems = 'center';
micBtn.style.justifyContent = 'center';
micBtn.style.fontSize = '48px';
micBtn.style.zIndex = 20;
micBtn.style.transition = 'background 0.2s';

micBtn.onmouseenter = () => micBtn.style.background = '#3367d6';
micBtn.onmouseleave = () => micBtn.style.background = '#4285f4';

document.body.appendChild(micBtn);

// Crea elementi per mostrare input vocale e grammatica LIS
const inputVocaleDiv = document.createElement('div');
inputVocaleDiv.style.position = 'absolute';
inputVocaleDiv.style.left = '50%';
inputVocaleDiv.style.transform = 'translateX(-50%)';
inputVocaleDiv.style.bottom = '80px';
inputVocaleDiv.style.zIndex = 10;
inputVocaleDiv.style.padding = '8px 24px';
inputVocaleDiv.style.fontSize = '18px';
inputVocaleDiv.style.background = '#fff';
inputVocaleDiv.style.borderRadius = '8px';
inputVocaleDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
inputVocaleDiv.innerHTML = '<b>Input vocale:</b> <span id="inputVocale"></span><br><b>Grammatica LIS:</b> <span id="lisVocale"></span>';
document.body.appendChild(inputVocaleDiv);

// Crea il punto interrogativo (inizialmente nascosto)
const domandaDiv = document.createElement('div');
domandaDiv.innerHTML = '<span style="font-size:64px;">❓</span>';
domandaDiv.style.position = 'absolute';
domandaDiv.style.right = '5%';
domandaDiv.style.top = '50%';
domandaDiv.style.transform = 'translateY(-50%)';
domandaDiv.style.zIndex = 30;
domandaDiv.style.display = 'none';
document.body.appendChild(domandaDiv);

// Crea il punto esclamativo (inizialmente nascosto)
const esclamazioneDiv = document.createElement('div');
esclamazioneDiv.innerHTML = '<span style="font-size:64px;">❗</span>';
esclamazioneDiv.style.position = 'absolute';
esclamazioneDiv.style.right = '5%';
esclamazioneDiv.style.top = '60%';
esclamazioneDiv.style.transform = 'translateY(-50%)';
esclamazioneDiv.style.zIndex = 30;
esclamazioneDiv.style.display = 'none';
document.body.appendChild(esclamazioneDiv);

function mostraSegno(segno) {
    if (segno === '?') {
        domandaDiv.style.display = 'block';
        esclamazioneDiv.style.display = 'none';
    } else if (segno === '!') {
        esclamazioneDiv.style.display = 'block';
        domandaDiv.style.display = 'none';
    }
    else {
        domandaDiv.style.display = 'none';
        esclamazioneDiv.style.display = 'none';
    }
}
function eseguiSequenzaDiretta(animazioni) {
    const neutralAnim = gltfAnimations.find(a => a.name.toLowerCase() === 'neutra');
    let index = 0;

    function playNext() {
        if (index >= animazioni.length) {
            if (neutralAnim) {
                mixer.stopAllAction();
                const neutralAction = mixer.clipAction(neutralAnim);
                neutralAction.reset();
                neutralAction.setLoop(THREE.LoopRepeat);
                neutralAction.play();
                model.scale.set(3, 3, 3);
                model.position.set(0, 0, 0);
            }
            domandaDiv.style.display = 'none';
            esclamazioneDiv.style.display = 'none';
            return;
        }

        const action = mixer.clipAction(animazioni[index]);
        mixer.stopAllAction();
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
        model.scale.set(3, 3, 3);
        model.position.set(0, 0, 0);

        mixer.addEventListener('finished', function handler() {
            mixer.removeEventListener('finished', handler);
            setTimeout(() => {
                index++;
                playNext();
            }, 200);
        });
    }

    playNext();
}


// --- API MICROFONO: riconoscimento vocale per "a"/"ah" e "b"/"b b" ---
let recognition = null;
let micActive = false;

function lisTransform(transcript) {
  // 1. Pulizia e split
  const cleaned = transcript
    .toLowerCase()
    .replace(/[?!.,"']/g, '')
    .trim();
  const words = cleaned.split(/\s+/);

  // 2. Dizionari
  const subjects = ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro'];
  const objectsMap = {
    mi: 'io', ti: 'tu', ci: 'noi', vi: 'voi',
    si: 'lui', lo: 'lui', la: 'lei', li: 'loro', le: 'loro'
  };
  const verbsMap = {
    aiuto: 'aiutare', aiuti: 'aiutare', aiuta: 'aiutare',
    aiutiamo: 'aiutare', aiutate: 'aiutare', aiutano: 'aiutare',
    sento: 'sentire', senti: 'sentire', sente: 'sentire',
    sentiamo: 'sentire', sentite: 'sentire', sentono: 'sentire',
    vedo: 'vedere', vedi: 'vedere', vede: 'vedere',
    vediamo: 'vedere', vedete: 'vedere', vedono: 'vedere',
    parlo: 'parlare', parli: 'parlare', parla: 'parlare',
    parliamo: 'parlare', parlate: 'parlare', parlano: 'parlare',
    sto: 'stare', stai: 'stare', sta: 'stare',
    stiamo: 'stare', state: 'stare', stanno: 'stare',
    vado: 'andare', vai: 'andare', va: 'andare',
    andiamo: 'andare', andate: 'andare', vanno: 'andare',
    chiami: 'chiamare', chiama: 'chiamare', chiamiamo: 'chiamare'
  };

  // 3. Riconoscimento categorie
  let subject   = null;
  let verb      = null;
  let object    = null;
  const extra   = [];
  
  words.forEach((w, i) => {
    const base = objectsMap[w] || w;

    if (!verb && verbsMap[w]) {
      verb = verbsMap[w];
    }
    else if (!subject && subjects.includes(base)) {
      subject = base;
    }
    else if (!object && (objectsMap[w] || (subjects.includes(base) && base !== subject))) {
      object = objectsMap[w] || base;
    }
    else {
      extra.push({ word: base, idx: i });
    }
  });

  // Debug
  console.log('LIS DEBUG →', { subject, verb, object, extra });

  // 4. Costruzione array finale in ordine LIS
  const result = [];
  if (subject) result.push(subject);
  if (verb)    result.push(verb);
  if (object)  result.push(object);

  // extra in ordine originale, senza duplicati
  extra
    .sort((a, b) => a.idx - b.idx)
    .forEach(e => {
      if (!result.includes(e.word)) result.push(e.word);
    });

  return result;
}




















function riconosciAnimazioniComposteFlessibile(paroleLIS) {
    let sequenza = [];
    let usate = new Set();

    // Cerca combinazioni da 3 a 2 parole
    for (let len = 3; len >= 2; len--) {
        for (let i = 0; i <= paroleLIS.length - len; i++) {
            const gruppo = paroleLIS.slice(i, i + len);
            const normale = gruppo.join('_');
            const invertita = [...gruppo].reverse().join('_');

            let anim = gltfAnimations.find(a => a.name.toLowerCase() === normale);
            if (!anim) {
                anim = gltfAnimations.find(a => a.name.toLowerCase() === invertita);
            }

            if (anim) {
                sequenza.push(anim);
                for (let j = i; j < i + len; j++) usate.add(j);
            }
        }
    }

    // Parole singole non usate
    for (let i = 0; i < paroleLIS.length; i++) {
        if (usate.has(i)) continue;
        const parola = paroleLIS[i];
        const anim = gltfAnimations.find(a => a.name.toLowerCase() === parola);
        if (anim) sequenza.push(anim);
    }

    return sequenza;
}



//animazioni

function playAnimationBySpeech(transcript) {
  if (!mixer || gltfAnimations.length === 0) return;

  // 1) Clean e split
  const cleaned = transcript
    .toLowerCase()
    .replace(/[?!.,"']/g, '')
    .trim();
  const originalWords = cleaned.split(/\s+/);
  document.getElementById('inputVocale').textContent = cleaned;

  // 2) Rilevo ? e !
  const qWords = ['come','perché','quando','dove','chi','cosa','quale','quanto'];
  const eWords = ['wow','evviva','fantastico','incredibile','ottimo','bravo','bene'];
  const isQ = qWords.some(w => originalWords.includes(w));
  const isE = !isQ && eWords.some(w => originalWords.includes(w));
  mostraSegno(isQ ? '?' : isE ? '!' : '');

  // 3) Definisco le frasi composte (2–3 parole)
  const complexPhrases = [
    'come stai','come va','come ti senti','tutto bene',
    'come ti chiami','che succede','dove sei'
  ];

  // 4) Single‐pass tokenization (phrase vs word)
  const tokens = [];
  for (let i = 0; i < originalWords.length;) {
    let matched = false;
    for (let len = 3; len >= 2; len--) {
      if (i + len <= originalWords.length) {
        const frag = originalWords.slice(i, i + len).join(' ');
        if (complexPhrases.includes(frag)) {
          tokens.push({ type:'phrase', text:frag });
          i += len;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      tokens.push({ type:'word', text: originalWords[i] });
      i++;
    }
  }

  // 5) Costruisco la sequenza animazioni
  const seq = [];
  const hasPhrase = tokens.some(t => t.type === 'phrase');

  if (!hasPhrase) {
    // frasi semplici → uso LIS completa (soggetto→verbo→oggetto→extra)
    const lisWords = lisTransform(cleaned);
    lisWords.forEach(lw => {
      const anim = gltfAnimations.find(a => a.name.toLowerCase() === lw);
      if (anim) seq.push(anim);
    });

    // mostro la grammatica LIS
    document.getElementById('lisVocale').textContent = lisWords.join(' ');
  }
  else {
    // frasi composte → rispetto ordine originale
    tokens.forEach(tok => {
      if (tok.type === 'phrase') {
        const name = tok.text.replace(/\s+/g, '_');
        const anim = gltfAnimations.find(a => a.name.toLowerCase() === name);
        if (anim) seq.push(anim);
      }
      else {
        // parola singola: applico lisTransform solo a lei,
        // per riconoscere verbo all’infinito, pronomi, ecc.
        const lisArr = lisTransform(tok.text);
        lisArr.forEach(lw => {
          const anim = gltfAnimations.find(a => a.name.toLowerCase() === lw);
          if (anim) seq.push(anim);
        });
      }
    });

    // mostro l’input originale
    document.getElementById('lisVocale').textContent = originalWords.join(' ');
  }

  // 6) Eseguo la sequenza
  eseguiSequenzaDiretta(seq);
}






















function startVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'it-IT';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = function(event) {
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            console.log('Hai detto:', transcript);

            playAnimationBySpeech(transcript);
        };

        recognition.onerror = function(event) {
            console.error('Errore riconoscimento vocale:', event.error);
        };

        recognition.onstart = function() {
            micActive = true;
            micBtn.innerHTML = '<span style="font-size:48px;">🎤</span>';
            playNeutralPose(); // Attiva la posa neutra all'avvio del microfono
            console.log('Riconoscimento vocale avviato');
        };

        recognition.onend = function() {
            // Riavvia automaticamente il riconoscimento per restare sempre in ascolto
            if (micActive) {
                recognition.start();
            } else {
                micBtn.innerHTML = '<span style="font-size:48px;">🎤</span>';
                playNeutralPose(); // Attiva la posa neutra quando il microfono si spegne
                console.log('Riconoscimento vocale terminato');
            }
        };

        recognition.start();
    } else {
        alert('Il riconoscimento vocale non è supportato su questo browser.');
    }
}

function stopVoiceRecognition() {
    if (recognition) {
        micActive = false;
        recognition.stop();
        recognition = null;
    }
}

micBtn.onclick = async function () {
    if (!micActive) {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            startVoiceRecognition();
        } catch (err) {
            alert('Permesso per il microfono negato o non disponibile.');
            console.error('Errore accesso microfono:', err);
        }
    } else {
        stopVoiceRecognition();
    }
};

// Posiziona la camera
camera.position.z = 5;
camera.position.y = 2;

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let clock = new THREE.Clock();

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}
animate();

function playNeutralPose() {
    if (!mixer || gltfAnimations.length === 0) return;
    const neutralAnim = gltfAnimations.find(a => a.name.toLowerCase() === 'neutra');
    if (neutralAnim) {
        mixer.stopAllAction();
        const neutralAction = mixer.clipAction(neutralAnim);
        neutralAction.reset();
        neutralAction.setLoop(THREE.LoopRepeat);
        neutralAction.play();
        model.scale.set(3, 3, 3);
        model.position.set(0, 0, 0);
    }
}