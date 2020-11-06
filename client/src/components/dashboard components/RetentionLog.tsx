import React, { useEffect, useState, useRef, CSSProperties } from "react";
import { useForm, Controller } from "react-hook-form";
import { Event, weeklyRetentionObject } from '../../models/event'
import { ChartWrapper, TableEmptySquare, TableWrapper,DatePickerWrapper, RetentionLogWrapper } from "components/styled components/admin.styles";
import { CircularProgress, TextField } from "@material-ui/core";

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
} from "@material-ui/core";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxHeight: '100px',
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
        minWidth: 650,
    },
  }),
);

const now = Date.now();
const monthAgo = now - 1000*60*60*24*31

const RetentionLog: React.FC<{}> = ({}) => {
  const classes = useStyles();
  const [allRetentions, setAllRetentions] = useState<weeklyRetentionObject[]>();
  const [dayZero, setDayZero] = useState<number>(monthAgo);

  useEffect( () => {
    fetchRetentions(dayZero);
  }, [dayZero])

  const fetchRetentions: (dayZero:number) => Promise<void> = async (query) => {
      const { data } = await axios({
        method: "get",
        url: `http://localhost:3001/events/retention?dayZero=${dayZero}`,
      });

      const retentions = data;
      setAllRetentions(retentions);
  };

  const getDateDifferences = (dateToStart:string):number => {

    if (new Date(dateToStart).getTime() < Date.now()) {
      return  new Date(dateToStart).getTime()
    } else return 0
  }

  const onEventChange = (dateToStart:string) => {
    setDayZero(getDateDifferences(dateToStart));
  }
      
  return (
    <RetentionLogWrapper>
      <h3>Retentions Cohort</h3>
      <h5>Shows the retentions for the chosen date until today</h5>
      { allRetentions ?
          <div>
          <DatePickerWrapper className="form">
          <TextField
            id="dayZero"
            label="start date"
            type="date"
            onChange={(e)=>{onEventChange(e.target.value)}}
            InputLabelProps={{
              shrink: true,
            }}
          />
          </DatePickerWrapper>
            <TableWrapper>
              <table>
                <tr>
                  <th  style={{backgroundColor:"#7777", width: "200px"}}></th>
                    {allRetentions.map(retention => 
                    <th style={{backgroundColor:"#7777"}}>
                      week {retention.registrationWeek}
                    </th>)}
                </tr>
                {/* <tr> 
                  <th>All Users</th>
                  {allRetentions.map(retention => <th>SUM</th>)}
                </tr> */}
                {allRetentions.map((retention, i) => (
                <tr>
                    <td style={{textAlign: "center"}}><b>{`${retention.start} - ${retention.end}`}</b></td>
                    {retention.weeklyRetention.map((percentage, j) =>
                      <td style={{backgroundColor:`RGB(150,${percentage * 2.5},80`}}>
                        {`${percentage}`}
                      </td>
                    )}
                </tr>
                ))}
              </table>
            </TableWrapper>
          </div>
      : <CircularProgress/>
      }
    </RetentionLogWrapper>
  );
};

export default RetentionLog;
