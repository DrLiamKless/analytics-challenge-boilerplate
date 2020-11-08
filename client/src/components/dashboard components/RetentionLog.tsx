import React, { useEffect, useState } from "react";
import { weeklyRetentionObject } from '../../models/event'
import { TableWrapper,DatePickerWrapper, RetentionLogWrapper } from "components/styled components/admin.styles";
import { CircularProgress, TextField } from "@material-ui/core";
import axios from 'axios'
import { monthAgo, monthAgoDate } from "helpers/helpers";

const RetentionLog: React.FC<{}> = ({}) => {
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
            defaultValue={monthAgoDate}
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
