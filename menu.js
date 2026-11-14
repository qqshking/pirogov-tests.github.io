
// Добавление нового теста: загрузите его HTML-файл и добавьте объект в массив ниже.
const TEST_CATALOG=[
  {title:'Анатомия',subtitle:'Коллоквиум 1 · Остеология и артрология; Коллоквиум 2 · Миология',file:'anatomy.html',category:'Анатомия'},
  {title:'Практика по получению первичных медицинских умений и навыков педиатрического профиля',subtitle:'Коллоквиум 1 · 584 вопроса',file:'practice_test.html',category:'Практика'}
];
const list=document.getElementById('tests');
document.getElementById('total').textContent=TEST_CATALOG.length;
for(const t of TEST_CATALOG){
 const card=document.createElement('a');card.className='tcard';card.href=t.file;
 const top=document.createElement('div');top.className='tt';
 const title=document.createElement('h3');title.textContent=t.title;
 const go=document.createElement('span');go.className='go';go.textContent='Открыть';
 const sub=document.createElement('p');sub.className='sm';sub.textContent=t.subtitle;
 top.append(title,go);card.append(top,sub);list.append(card);
}
