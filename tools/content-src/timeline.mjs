// The history timeline: periods of British history and events that light up when she
// knows the linked questions.

const PERIODS = [
  ['Stone Age', -3500, -2500], ['Bronze Age', -2500, -800], ['Iron Age', -800, 43], ['Roman Britain', 43, 410],
  ['Anglo-Saxons and Vikings', 410, 1066], ['Medieval', 1066, 1485], ['Tudors', 1485, 1603], ['Stuarts', 1603, 1714],
  ['Georgians', 1714, 1837], ['Victorians', 1837, 1901], ['20th century', 1901, 2000],
];

// [year, label, item ids that teach it]
const EVENTS = [
  [-3000, 'Work begins on Stonehenge', ['history.t.stonehenge']],
  [-2560, 'Great Pyramid finished', ['history.t.o6', 'history.a.egypt-river']],
  [-776, 'First recorded Olympic Games', ['history.a.olympics']],
  [-508, 'Democracy in Athens', ['history.a.democracy']],
  [-490, 'Battle of Marathon', ['history.a.marathon']],
  [43, 'Romans invade Britain', ['history.t.romans']],
  [410, 'Romans leave Britain', ['history.t.romans-leave']],
  [793, 'Vikings raid Lindisfarne', ['history.t.lindisfarne']],
  [871, 'Alfred becomes king of Wessex', ['history.t.alfred']],
  [900, 'House of Wisdom in Baghdad', ['history.wo.baghdad', 'history.wo.algebra']],
  [1066, 'Battle of Hastings', ['history.t.hastings', 'history.1066.date']],
  [1086, 'Domesday survey', ['history.n.domesday']],
  [1099, 'Crusaders capture Jerusalem', ['history.ch.jerusalem']],
  [1170, 'Becket murdered', ['history.bk.date']],
  [1215, 'Magna Carta', ['history.t.magna', 'history.mc.where']],
  [1348, 'Black Death reaches England', ['history.t.blackdeath', 'history.bd.year']],
  [1381, 'Peasants’ Revolt', ['history.pr.year']],
  [1415, 'Battle of Agincourt', ['history.wf.agincourt']],
  [1485, 'Battle of Bosworth', ['history.wf.bosworth']],
  [1534, 'Henry VIII breaks with Rome', ['history.td.supremacy', 'history.td.break']],
  [1588, 'Spanish Armada', ['history.td.armada']],
  [1603, 'Death of Elizabeth I', ['history.td.elizabeth']],
  [1837, 'Victoria becomes queen', ['history.t.victoria']],
  [1914, 'First World War begins', ['history.t.ww1']],
  [1939, 'Second World War begins', ['history.t.ww2']],
];

export default [{
  subject: 'history', deck: 'timeline', topics: [], items: [],
  timeline: {
    periods: PERIODS.map(([name, from, to]) => ({ name, from, to })),
    events: EVENTS.map(([year, label, items]) => ({ year, label, items })),
  },
}];
