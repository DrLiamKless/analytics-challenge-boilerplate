import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';
import { MapWrapper } from "components/styled components/admin.styles";
import { Event } from '../../models/event'
import axios from 'axios'
import { CircularProgress } from "@material-ui/core";

const mapContainerStyle = {
    width: '100%',
    height: '100%'  
    };

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
        <h3>Events Map</h3>
        <h5>Shows the location for all the events</h5>
        {allEvents ? 
            <LoadScript googleMapsApiKey={'AIzaSyCO2CJy9I3evBaiw5rCesn6vzC7TmC4vH0'}>
                <GoogleMap
                options={ {disableDefaultUI: true} }
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
                            : <CircularProgress/>
                    }
                    </MarkerClusterer>
                </GoogleMap>
            </LoadScript>
        : <CircularProgress/>}
    </MapWrapper>
    );
};

export default EventsMap;
