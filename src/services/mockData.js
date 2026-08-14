/**
 * Mock data para desenvolvimento do Dashboard de Protocolos.
 * Simula ~80 registros do "Caderno de Entrada 2026" com dados realistas.
 */

const CANAIS = ['E-mail', 'Balcão', 'E-protocolo', 'Físico'];
const TIPOS = [
  'Ofício',
  'Ficha de Cadastro',
  'Abaixo-assinado',
  'Requerimento',
  'Memorando',
  'Certidão',
  'Comunicação Interna',
  'Declaração',
];
const UNIDADES = ['ASSAD', 'SUOP', 'DIPRIN', 'SEMAD', 'GAPRE', 'SEPLAN', 'SEMOB'];
const INTERESSADOS = [
  'João da Silva',
  'Maria Oliveira',
  'Construtora Horizonte Ltda',
  'Pedro Santos',
  'Associação dos Moradores',
  'Ana Beatriz Costa',
  'TechBuild Engenharia',
  'Carlos Eduardo Nunes',
  'Fernanda Lima',
  'Sindicato dos Engenheiros',
  'Imobiliária Central',
  'Roberto Almeida',
  'Cooperativa Agrícola União',
  'Luciana Ferreira',
  'Empresa Minas Construtora',
  'Antônio Carlos Souza',
  'Paula Andrade',
  'Rui Barbosa Neto',
  'Drogaria Popular Ltda',
  'Supermercado Bom Preço',
];
const ASSUNTOS = [
  'Solicitação de alvará de construção',
  'Pedido de certidão negativa de débitos',
  'Denúncia de obra irregular no Bairro Centro',
  'Requerimento de aprovação de projeto',
  'Cadastro de nova empresa no município',
  'Recurso contra auto de infração',
  'Solicitação de vistoria técnica',
  'Pedido de segunda via de documento',
  'Consulta de viabilidade construtiva',
  'Abaixo-assinado contra fechamento de rua',
  'Autorização para evento público',
  'Regularização de imóvel',
  'Solicitação de informação processual',
  'Pedido de prorrogação de prazo',
  'Comunicação de mudança de endereço',
  'Cancelamento de protocolo anterior',
  'Emissão de parecer técnico',
  'Renovação de licença de funcionamento',
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function padZero(n) {
  return String(n).padStart(2, '0');
}

function generateProtocolNumber() {
  return `EP-${randomInt(2026, 2026)}/${padZero(randomInt(1, 12))}-${randomInt(1000, 9999)}`;
}

function generateProcessNumber() {
  return `${randomInt(10000, 99999)}.${randomInt(100000, 999999)}/${randomInt(2024, 2026)}-${randomInt(10, 99)}`;
}

/**
 * Gera os registros mock. Chamado uma vez na importação.
 * Inclui propositalmente 2 linhas com data vazia para testar EC03.
 */
function generateMockRecords() {
  const records = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Registros no mês atual (~50)
  for (let i = 0; i < 50; i++) {
    const day = randomInt(1, Math.min(now.getDate(), 28));
    const canal = randomItem(CANAIS);

    records.push({
      'DATA': `${padZero(day)}/${padZero(currentMonth + 1)}/${currentYear}`,
      'MEIO DE PROTOCOLIZAÇÃO': canal,
      'Nº E-PROTOCOLO': canal === 'E-protocolo' ? generateProtocolNumber() : '',
      'TIPO DE DOCUMENTO': randomItem(TIPOS),
      'INTERESSADO': randomItem(INTERESSADOS),
      'ASSUNTO': randomItem(ASSUNTOS),
      'Nº PROCESSO': generateProcessNumber(),
      'UNIDADE': randomItem(UNIDADES),
    });
  }

  // Registros no mês anterior (~25)
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  for (let i = 0; i < 25; i++) {
    const day = randomInt(1, 28);
    const canal = randomItem(CANAIS);

    records.push({
      'DATA': `${padZero(day)}/${padZero(prevMonth + 1)}/${prevYear}`,
      'MEIO DE PROTOCOLIZAÇÃO': canal,
      'Nº E-PROTOCOLO': canal === 'E-protocolo' ? generateProtocolNumber() : '',
      'TIPO DE DOCUMENTO': randomItem(TIPOS),
      'INTERESSADO': randomItem(INTERESSADOS),
      'ASSUNTO': randomItem(ASSUNTOS),
      'Nº PROCESSO': generateProcessNumber(),
      'UNIDADE': randomItem(UNIDADES),
    });
  }

  // 2 linhas com data vazia (teste EC03)
  records.push({
    'DATA': '',
    'MEIO DE PROTOCOLIZAÇÃO': 'E-mail',
    'Nº E-PROTOCOLO': '',
    'TIPO DE DOCUMENTO': 'Ofício',
    'INTERESSADO': 'Registro Sem Data',
    'ASSUNTO': 'Teste de linha sem data',
    'Nº PROCESSO': '99999.000000/2026-01',
    'UNIDADE': 'ASSAD',
  });

  records.push({
    'DATA': '',
    'MEIO DE PROTOCOLIZAÇÃO': 'Balcão',
    'Nº E-PROTOCOLO': '',
    'TIPO DE DOCUMENTO': 'Requerimento',
    'INTERESSADO': 'Outro Registro Sem Data',
    'ASSUNTO': 'Outra linha sem campo data',
    'Nº PROCESSO': '88888.000000/2026-02',
    'UNIDADE': 'SUOP',
  });

  return records;
}

export const MOCK_HEADERS = [
  'DATA',
  'MEIO DE PROTOCOLIZAÇÃO',
  'Nº E-PROTOCOLO',
  'TIPO DE DOCUMENTO',
  'INTERESSADO',
  'ASSUNTO',
  'Nº PROCESSO',
  'UNIDADE',
];

export const MOCK_ROWS = generateMockRecords();

export const MOCK_RESPONSE = {
  headers: MOCK_HEADERS,
  rows: MOCK_ROWS,
  timestamp: new Date().toISOString(),
};
