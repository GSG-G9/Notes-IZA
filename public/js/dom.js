const div = document.querySelector('.test');

fetch(`/notes/${userID}`).then((res) => res.json()).then((results) => {
  if (results.status === 200) {
    const { data } = results;
    div.textContent = data;
    return;
  }
  throw new Error();
}).catch(() => { div.textContent = 'No Data ...!'; });
