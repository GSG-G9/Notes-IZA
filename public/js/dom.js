const loggincontainer = document.querySelector('.loggin-container');
const signupcontainer = document.querySelector('.signup-container');
const loginButton = document.getElementById('log-in');

const openForm = () => {
  console.log('open');
  loggincontainer.style.display = 'none';
  signupcontainer.style.display = 'flex';
};

// fetch('/addNote/${userID}', {
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   method: 'POST',
//   body: JSON.stringify(data),
// }).then((res) => res.json()).then(() => {

// }).catch(console.log);
