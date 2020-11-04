import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';
import { MapWrapper } from "components/styled components/cohort.styles";
import { Event } from '../../models/event'
import axios from 'axios'

const mapContainerStyle = {
    width: '100%',
    height: '100%'
    };

const ClustererOptions = {
    imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
    }

const defaultCenter = { lat: 31.45, lng: 35 };

const EventsMap: React.FC<{}> = ({}) => {
    const [allEvents, setAllEvents] = useState<Event[]>();

    useEffect( () => {
        fetchEvents();
    }, [])

    const fetchEvents: () => Promise<void> = async () => {
        const { data } = await axios({
          method: "get",
          url: 'http://localhost:3001/events/all',
        });
        const events = data;
        setAllEvents(events);
      };

  return (
    <MapWrapper>
        <LoadScript googleMapsApiKey={'AIzaSyCO2CJy9I3evBaiw5rCesn6vzC7TmC4vH0'}>
            <GoogleMap
              options={ 
                {
                    disableDefaultUI: true
                }
              }
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={1.5}
            >
                <MarkerClusterer
                    averageCenter
                    enableRetinaIcons
                    gridSize={80}
                >
                { 
                    (clusterer) => allEvents ? allEvents.map(event => (
                        <Marker
                        key={event._id} 
                        clusterer={clusterer}
                        position={
                            {  
                                lat: event.geolocation.location.lat, 
                                lng: event.geolocation.location.lng
                            }
                        }
                        />
                    ))

                        : <h1>Loader</h1>
                }
                </MarkerClusterer>
            </GoogleMap>
        </LoadScript>
    </MapWrapper>
  );
};

export default EventsMap;
