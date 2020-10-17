import React, {
  ChangeEvent,
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  Map, MapProps, Marker, TileLayer, LeafletEvents,
} from 'react-leaflet';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FiPlus } from 'react-icons/fi';

import '../styles/pages/create-orphanage.css';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import mapIcon from '../utils/mapIcon';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import api from '../services/api';

interface FormOrphanages {
  name: string;
  latitude: number;
  longitude: number;
  instructions: string;
  about: string;
  opening_hours: string;
  open_on_weekends: boolean;
}

const CreateOrphanage: React.FC = () => {
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const geoLocalization = () => {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    });
  };

  useEffect(() => {
    geoLocalization();
  }, []);

  const handleMapClick = useCallback((event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }, []);

  const handleSelectImages = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);
    const selectedImagesPreview = selectedImages.map((image) => URL.createObjectURL(image));
    setPreviewImages(selectedImagesPreview);
  }, []);

  const handleSubmit = useCallback(
    async (data: FormOrphanages) => {
      const {
        name,
        instructions,
        about,
        opening_hours,
      } = data;

      const { latitude, longitude } = position;

      const dataForm = new FormData();

      dataForm.append('name', name);
      dataForm.append('instructions', instructions);
      dataForm.append('about', about);
      dataForm.append('opening_hours', opening_hours);
      dataForm.append('latitude', String(latitude));
      dataForm.append('longitude', String(longitude));
      dataForm.append('open_on_weekends', String(open_on_weekends));
      images.forEach((image) => {
        dataForm.append('images', image);
      });

      await api.post('orphanages', dataForm);

      alert('Cadastro realizado com sucesso');

      history.push('/app');
    }, [history, images, open_on_weekends, position],
  );

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <Form ref={formRef} onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[position.latitude, position.longitude]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
              load={geoLocalization}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0
                && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
                )}

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <Input id="name" name="name" placeholder="Nome do Orfanato" />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre
                {' '}
                <span>Máximo de 300 caracteres</span>
              </label>
              <Textarea id="name" name="about" maxLength={300} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image) => (<img key={image} src={image} alt={image} />))}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>

              </div>
              <input multiple onChange={handleSelectImages} type="file" id="image[]" />

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <Textarea id="instructions" name="instructions" />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horario de Funcionamento</label>
              <Input id="opening_hours" name="opening_hours" />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </Form>
      </main>
    </div>
  );
};
export default CreateOrphanage;
// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
