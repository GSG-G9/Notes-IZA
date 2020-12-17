const displayName = document.getElementById('display-name');
const displayBio = document.getElementById('display-bio');
const addNoteButton = document.getElementById('add-note');
const container = document.getElementById('container');
const noteHead = document.getElementById('note-head');
const noteText = document.getElementById('note-text');
const notesDiv = document.getElementById('notes-div');
const addNoteForm = document.getElementById('add-note-form');
const logoutButton = document.getElementById('logout');

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const openForm = () => {
  console.log('open');
  notesDiv.style.display = 'none';
  addNoteForm.style.display = 'flex';
};
const deleteNote = (noteid) => {
  fetch('/notes', {
    method: 'delete',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      id: noteid,
    }),
  })
    .then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    });
};

const createNote = (headerText, contentText, noteId) => {
  const newNote = document.createElement('div');
  newNote.classList.add('note-div');
  newNote.style.backgroundColor = getRandomColor();
  const headerpara = document.createElement('p');
  newNote.classList.add('headerpara');
  headerpara.textContent = headerText;
  headerpara.style.fontSize = '30px';
  headerpara.style.fontWeight = 'bold';
  headerpara.style.borderBottom = '3px solid black';
  const contentpara = document.createElement('p');
  newNote.classList.add('contentpara');
  contentpara.textContent = contentText;
  contentpara.style.fontSize = '24px';
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('deleteButton');
  deleteButton.textContent = 'delete';
  deleteButton.style.marginTop = '130px';
  deleteButton.addEventListener('click', () => {
    console.log('delete');
    deleteNote(noteId);
  });
  newNote.append(headerpara, contentpara, deleteButton);
  container.appendChild(newNote);
};

// const displayUser = () => {
//   console.log('login');
//   fetch('/login', {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     method: 'POST',
//     body: JSON.stringify(data),
//   }).then((res) => res.json()).then((results) => {
//     console.log(results);
//     if (results.status === 200) {
//       const { data } = results;
//       displayName.textContent = data[0].name;

//       displayBio.textContent = data[0].bio;
//       return;
//     }
//     throw new Error();
//   });
// };
// displayUser();

fetch('/notes').then((res) => res.json()).then((results) => {
  if (results.status === 200) {
    const { data } = results;
    console.log(data);
    notesDiv.append(data.map((el) => createNote(el.header, el.content, el.id)));
    return;
  }
  throw new Error();
});

fetch('/getUser').then((res) => res.json()).then((results) => {
  if (results.status === 200) {
    const { data } = results;
    displayName.textContent = data[0].name;
    displayBio.textContent = data[0].bio;
    return;
  }
  throw new Error();
})
  .catch(() => { div.textContent = 'No Data ...!'; });
// logout
logoutButton.addEventListener('click', () => {
  fetch('/logout', { method: 'POST' }).then((response) => {
    if (response.redirected) {
      window.location.href = response.url;
    }
  });
});
// addNoteButton.addEventListener('click', () => {
//   const data = {
//     header: noteHead.value,
//     content: noteText.value,
//   };
//   fetch('/notes', {.note-div
//       'Content-Type': 'application/json',
//     },
//     method: 'POST',
//     body: JSON.stringify(data),
//   }).then((res) => res.json()).then((results) => {
//     console.log(results);
//     if (results.status === 200) {
//       const { data } = results;
//       // createNote(data[0].header, data[0].content);
//       return;
//     }
//     throw new Error();
//   });
// });
