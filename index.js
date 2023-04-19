// Import zgodny z CDN wiec trzea uzyc jsna i module
import { initializeApp  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, set,onValue,remove} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";

// configuracja naszej bazy danych
const firebaseConfig = 
{
  apiKey: **************,
  authDomain: **************,
  databaseURL: **************,
  projectId: **************,
  storageBucket: **************,
  messagingSenderId: **************,
  appId: **************,
};
    
// Zainicjowanie poloczenia z firebasem
const firebase=initializeApp(firebaseConfig);

// Zainicjowanie popoloczenia z baza danych
const db = getDatabase(firebase);

// Pobranie nazwy uzytkownika
const nick = prompt("Podaj nazwe uzytkownika: ");


// Nasłuchiwanie formularza i wywolywanie funkcji wysylania
document.getElementById("formularz").addEventListener("submit", wyslijWiadomosc);

// Wysłanie tresci do bazy danych
function wyslijWiadomosc(e) {
  //preventDefault() metoda anuluje zdarzenie, jeśli można anulować, co oznacza, że domyślna akcja, która należy do zdarzenia nie wystąpią.
  e.preventDefault();
  // Pobieramy czas ktory bedzie naszym niepowtarzalnym kluczem by wiadomosci sie nie nadpisywaly
  let timestamp =  Date.now();
  //stworzenie dowiazania do pola z trescia
  const messageInput = document.getElementById("tresc");
  //poranie wartosci
  const wiadomosc = messageInput.value;
  //wyzerowanie pola
  messageInput.value = "";
  // tworzymy kolekcje i wysylamy ja
  set(ref(db, "messages/" + timestamp), {
    nick,
    wiadomosc,
  }); 
}


//zamiana wyniku na tablice
function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};


// wyświetl komunikaty
//sprawdź nowe wiadomości


const starCountRef = ref(db,"messages/");



onValue(starCountRef, (snapshot) => 
{

  const lista = document.querySelector('#wiadomosci');
  lista.innerText = '';


  const tab = snapshotToArray(snapshot);
  for (const iterator of tab) 
  {


  
    let array=(new Date(Number(iterator.key))).toString().split(" ");
    const newLi = document.createElement('li'); // <li>
    const newspan = document.createElement('span'); // <li>
    newspan.innerText=`${array[2]} ${array[1]} ${array[3]} ${array[4]}:`;
    newLi.className = "data";
    if(nick === iterator.nick)
    {
      newLi.className = "prawa";
      newLi.addEventListener('click', removeItem);
    } 
    else {newLi.className = "lewa";}
    newLi.innerText = iterator.wiadomosc;
    newLi.dataset.id = iterator.key;
    newLi.appendChild(newspan);

    lista.appendChild(newLi);


  }
  

});


const removeItem = event => 
{
  const id = Number(event.target.dataset.id);
  remove(ref(db, "messages/"+id));

};



