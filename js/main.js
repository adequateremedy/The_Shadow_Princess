fetch('data/chapters.json')
  .then(response => response.json())
  .then(data => {
    console.log("CHAPTER DATA LOADED:");
    console.log(data);
  })
  .catch(error => {
    console.error("ERROR LOADING CHAPTER DATA:", error);
  });
