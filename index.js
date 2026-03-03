const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

app.use(express.json()); // ✅ fondamentale per leggere JSON nel body

let songs = [
  { id: crypto.randomUUID(), title: "Shape of You", artist: "Ed Sheeran" },
  { id: crypto.randomUUID(), title: "Blinding Lights", artist: "The Weeknd" },
  { id: crypto.randomUUID(), title: "Lose Yourself", artist: "Eminem" }
];


app.get('/songs', (req, res) => {
  res.status(200).json(songs);
});


app.get("/songs/:id", (req, res) => {
    const { id } = req.params;
    const song = songs.find((s) => s.id === id); // canzone da selezionare

    if(!song) {

      return res.status(404).json({message: 'canzone non trovata'});  

    } 

    res.status(200).json(song);
    
});


app.post('/songs', (req, res) => {

  // ✅ escludo id dal body (protezione)
  const { id, ...safeBody } = req.body;

  // ✅ id creato SOLO dal server
  const newSong = {id: crypto.randomUUID(), ...safeBody};

  songs.push(newSong);

  res.status(201).json(newSong);
});


app.put('/songs/:id', (req, res) => {

  const { id: paramId } = req.params; // 👈 rinominato per evitare conflitti
  const song = songs.find(s => s.id === paramId); // song non aggiornato

  if(!song) {

    return res.status(404).json({message: 'canzone non trovata'});  

  } 

  // ✅ escludo id dal body (protezione)
  const { id, ...safeBody } = req.body; // 👈 nessun conflitto con id perche' l'ho rinominato prima
  
  // ✅ canzone aggiornata
  const editSong = { ...song, ...safeBody };
        
  // ✅ serve per ricalcolare array originale inserendo la canzone aggiornata
  songs = songs.map(s => s.id === paramId ? editSong : s);

  res.status(200).json(editSong);

});


app.delete("/songs/:id", (req, res) => {
    const { id } = req.params;
    const song = songs.find((s) => s.id === id); // canzone da cancellare

    if(!song) {

      return res.status(404).json({message: 'canzone non trovata'});  

    } 

    // ✅ serve per ricalcolare array originale eliminando la canzone selezionata
    songs = songs.filter((s) => s.id !== id);
          
    res.status(200).json(songs);

});


app.listen(PORT, () => {
  console.log(`server running on PORT:${PORT}`);
});


