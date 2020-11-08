import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Event } from '../../models/event'
import { EventLogWrapper, FormWrapper } from "components/styled components/admin.styles";
import axios from 'axios'
import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Typography,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Table,
    InputLabel,
    Input,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    IconButton,
    CircularProgress,
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import { Filter } from "../../../../server/backend/event-routes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      padding: "10px",
      maxWidth: '100%',
      maxHeight: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    table: {
      maxWidth: "100%",
    },
    formControl: {
      width: "100%",
    }
  }),
);

const EventsLog: React.FC<{}> = ({}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const [allEvents, setAllEvents] = useState<{events:Event[], more:boolean}>();
    const { register, handleSubmit, watch, errors, control } = useForm();
    const [filters, setFilters] = useState<Filter>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);


    const observer = useRef<any>();
    
    const lastEventAccordionRef = useCallback((node:HTMLElement) => {

      if(loading) return
      if(observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting && hasMore) {
          setPageNumber(prevPageNumber => prevPageNumber+1)
          setLoading(true);
        }
      })
      if(node) observer.current.observe(node);
    },[loading, hasMore])


    const onSubmit = (data:Filter) => {
      setFilters(data);
    };

    useEffect( () => {
     const query:string = adjustQuery(filters);
      fetchSessions(query);
    }, [pageNumber])

    useEffect(() => {
      const query:string = adjustQuery(filters);
      setPageNumber(1);
      fetchSessions(query); 
    }, [filters])

    const fetchSessions: (query:string) => Promise<void> = async (query) => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/chart/all-filtered/${pageNumber}?${query}`,
        });

        const events:{events:Event[], more:boolean} = data;
        setAllEvents(prevEvents => {
          if(prevEvents && pageNumber !== 1) {
            const newEvents:{events:Event[], more:boolean} = prevEvents 
            newEvents.events.push(...events.events);
            return newEvents
          } else {
            return events
          }
        });
          setLoading(false);
          setHasMore(events.more);
    };

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
    };

    const adjustQuery:(filter:Filter | undefined)=>string = (filter) => {
      const queryArray:any[] = [];

      for (const key in filter) {
        if(filter[key] !== "") {
          queryArray.push(`${key}=${filter[key]}`);
        }
      }

      const queryString:string = queryArray.join("&")
      return queryString
    }
      
  return (
    <EventLogWrapper>
      <h3>Events Log</h3>
      <h5>A Usefull filtered search for all off the website's events</h5>
      { allEvents ?
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormWrapper className="form">
              <FormControl size="small" className={classes.formControl}>
              <InputLabel id="sort">search</InputLabel>
                <Controller
                  as={
                    <Input 
                    id="search"
                    startAdornment={
                      <InputAdornment position="start">
                        <KeyboardIcon />
                      </InputAdornment>
                    }/>
                  }
                  name="search"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
              <FormControl size="small" className={classes.formControl}>
                <InputLabel id="sort">sort</InputLabel>
                <Controller
                  as={
                    <Select labelId="sort" label={"sort"}>
                      <MenuItem value="+date">start</MenuItem>
                      <MenuItem value="-date">end</MenuItem>
                    </Select>
                  }
                  name="sorting"
                  control={control}
                  defaultValue="+date"
                />
              </FormControl>
              <FormControl size="small" className={classes.formControl}>
                <InputLabel id="event">event</InputLabel>
                <Controller
                  as={
                    <Select labelId="event" label={"event"}>
                      <MenuItem value="">all</MenuItem>
                      <MenuItem value="login">login</MenuItem>
                      <MenuItem value="signup">signup</MenuItem>
                      <MenuItem value="admin">admin</MenuItem>
                      <MenuItem value="/">/</MenuItem>
                    </Select>
                  }
                  name="type"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
              <FormControl size="small" className={classes.formControl}>
                <InputLabel id="browser">browser</InputLabel>
                <Controller
                  as={
                    <Select labelId="browser" label={"browser"}>
                      <MenuItem value="">all</MenuItem>
                      <MenuItem value="chrome">chrome</MenuItem>
                      <MenuItem value="safari">safari</MenuItem>
                      <MenuItem value="edge">edge</MenuItem>
                      <MenuItem value="firefox">firefox</MenuItem>
                      <MenuItem value="ie">ie</MenuItem>
                      <MenuItem value="other">other</MenuItem>  
                    </Select>
                  }
                  name="browser"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
              <IconButton type="submit" color="primary">
                <SearchIcon/>
              </IconButton>
          </FormWrapper>
        </form>
          <div className={classes.root}>
            { allEvents.events.map((event:Event,i) => {
              if (allEvents.events.length === i + 1) {
                return (
              <div>  
                <Accordion ref={lastEventAccordionRef} expanded={expanded === `panel${i+1}`} onChange={handleChange(`panel${i+1}`)}>
                  <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${i+1}bh-content`}
                  id={`panel${i+1}bh-header`}>
                    <Typography className={classes.heading}>{event.name}</Typography>
                    <Typography className={classes.secondaryHeading}>By User-Id {event.distinct_user_id}</Typography>
                  </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead>
                      <TableRow>
                          <TableCell align="center">Date</TableCell>
                          <TableCell align="center">os</TableCell>
                          <TableCell align="center">browser</TableCell>
                          <TableCell align="center">url</TableCell>
                          <TableCell align="center">session id</TableCell>
                      </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">
                              {new Date(event.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="center">{event.os}</TableCell>
                          <TableCell align="center">{event.browser}</TableCell>
                          <TableCell align="center">{event.url}</TableCell>
                          <TableCell align="center">{event.session_id}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
                </Accordion>
                {loading && <h5>loading ......</h5>}
              </div>)
              } else {
                return (
                <Accordion expanded={expanded === `panel${i+1}`} onChange={handleChange(`panel${i+1}`)}>
                  <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${i+1}bh-content`}
                  id={`panel${i+1}bh-header`}
                  >
                    <Typography className={classes.heading}>{event.name}</Typography>
                    <Typography className={classes.secondaryHeading}>By User-Id {event.distinct_user_id}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">os</TableCell>
                            <TableCell align="center">browser</TableCell>
                            <TableCell align="center">url</TableCell>
                            <TableCell align="center">session id</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">
                                {new Date(event.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">{event.os}</TableCell>
                            <TableCell align="center">{event.browser}</TableCell>
                            <TableCell align="center">{event.url}</TableCell>
                            <TableCell align="center">{event.session_id}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              )}
            })}
          </div>
      </div>
      : <CircularProgress/>
      }
    </EventLogWrapper>
  );
};

export default EventsLog;
