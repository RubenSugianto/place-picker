import { useRef, useState, useEffect } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';

import { sortPlacesByDistance} from './loc.js';

// gaperlu pake use effect karna asynronous, lgsg kelar abis dijalanin (gaada callback)
// ditaro diluar juga bole biar jalanin SEKALI doang ketika browser dibuka, bukan ketika component app reload
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
const storedPlaces = storedIds.map((id) => 
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  /* 
  use effect ini dipakai untuk menghindari infinite loop 
  kayak contoh code dibawah ini kan dia ada state, nah dia kan bakal rerender, makanya butuh use effect
  use effecrt itu terima 2 param functionnya, yaitu ya yg pertama mau ngapain
  lalu yang kedua itu dependencies, dependencies itu kalo [], dia bakal jalan SETELAH component dirender
  kalo ada isinya, dia biasanya ikutin state yang berubah
  */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position)=> {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
  
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    if( storedIds.indexOf(id) === -1) {
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedIds]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem('selectedPlaces', JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)));
  }

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting Place By Distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
