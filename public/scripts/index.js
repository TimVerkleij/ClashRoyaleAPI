fetch('/wars')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  });