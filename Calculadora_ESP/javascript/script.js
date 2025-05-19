const multiplicadores = {
  E: 1,
  D: 3,
  C: 9,
  B: 27,
  A: 81,
  S: 243,
  SS: 729,
};

// Sujeito a aumentar conforme você quiser
const sufixos = {
  "": 1,
  K: 1e3,
  M: 1e6,
  B: 1e9,
  T: 1e12,
  Qa: 1e15,
  Qi: 1e18,
  Sx: 1e21,
  Sp: 1e24,
  Oc: 1e27,
  // pode continuar aqui
};

// Função que interpreta o valor com sufixo e converte para número
function interpretarValorComSufixo(texto) {
  // Retira espaços e coloca maiúscula nos sufixos para facilitar
  texto = texto.trim();

  // Expressão regular para separar número + sufixo
  const regex = /^([\d,.]+)\s*([a-zA-Z]*)$/;
  const match = texto.match(regex);

  if (!match) {
    return NaN; // formato inválido
  }

  // Pega número (substitui vírgula por ponto para decimal)
  let numeroStr = match[1].replace(",", ".");
  let numero = parseFloat(numeroStr);
  if (isNaN(numero)) return NaN;

  // Pega sufixo e converte para maiúscula (exceto o segundo caractere para casos tipo Qa, Qi)
  let sufixo = match[2];
  // Para manter maiúscula no primeiro caractere e minúscula no segundo, se existir
  if (sufixo.length === 2) {
    sufixo = sufixo.charAt(0).toUpperCase() + sufixo.charAt(1).toLowerCase();
  } else {
    sufixo = sufixo.toUpperCase();
  }

  if (!(sufixo in sufixos)) {
    // Se sufixo não existe, tenta '' (sem sufixo)
    if (sufixo !== "") return NaN;
  }

  const multiplicador = sufixos[sufixo] || 1;
  return numero * multiplicador;
}

// Reutilizamos a função formatarNumero que você já conhece
function formatarNumero(valor) {
  if (valor === 0) return "0";

  const base = 1000;
  const expoente = Math.floor(Math.log10(Math.abs(valor)) / 3);
  const sufixosLista = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
  const indiceSufixo = Math.min(expoente, sufixosLista.length - 1);
  const valorFormatado = valor / Math.pow(base, indiceSufixo);

  return valorFormatado.toFixed(2) + sufixosLista[indiceSufixo];
}

function calcular() {
  const destino = document.getElementById("rankDestino").value;
  const precoTexto = document.getElementById("precoE").value;

  const precoE = interpretarValorComSufixo(precoTexto);

  if (isNaN(precoE) || precoE <= 0) {
    alert(
      "Por favor, insira um preço válido para a espada E, com ou sem sufixo."
    );
    return;
  }

  let totalPossuido = 0;
  for (const rank of Object.keys(multiplicadores)) {
    const qtd = parseInt(document.getElementById(rank).value) || 0;
    totalPossuido += qtd * multiplicadores[rank];
  }

  const totalNecessario = multiplicadores[destino];
  const faltam = Math.max(totalNecessario - totalPossuido, 0);
  const custo = faltam * precoE;

  document.getElementById("resultado").innerHTML = `
        <p>✅ Total necessário para <b>${destino}</b>: <b>${formatarNumero(
    totalNecessario
  )}</b> espadas E</p>
        <p>🎒 Você já possui: <b>${formatarNumero(
          totalPossuido
        )}</b> espadas E</p>
        <p>🧩 Faltam: <b>${formatarNumero(faltam)}</b> espadas E</p>
        <p>💰 Custo restante: <b>${formatarNumero(custo)}</b></p>
      `;
}
