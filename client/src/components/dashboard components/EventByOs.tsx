import React, { useEffect, useState } from "react";
import { Event } from '../../models/event'
import { ChartWrapper, DatePickerWrapper } from "components/styled components/admin.styles";
import axios from 'axios'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend, Pie ,PieChart, Cell, ResponsiveContainer } from 'recharts'
import { TextField, CircularProgress  } from "@material-ui/core";

const month = 1000*60*60*24*31
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AAAAAA','#800080'];

const now = Date.now();
const monthAgo = now - 1000*60*60*24*31

const EventsByOs: React.FC<{}> = ({}) => {
    const [allOsCounts, setAllOsCounts] = useState<object[]>();
    const [dayZero, setDayZero] = useState<number>(monthAgo);

    useEffect( () => {
        fetchSessions(dayZero);
    }, [dayZero])

    const fetchSessions: (dayZero:number) => Promise<void> = async () => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/chart/os/${dayZero}`,
        });
        const counts = data;
        setAllOsCounts(counts);
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
    <ChartWrapper>
      <h3>OS Calculator</h3>
      <h5>Counts the different OS uses for each event</h5>
      { allOsCounts ?
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
        <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={300}>
            <Pie 
                data={allOsCounts}
                dataKey="count"
                nameKey="os"
                cx="50%"
                cy="50%"
                innerRadius={50}
                fill="#8884d8"
                label
            >
            {allOsCounts.map((entry, index) => 
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }    
            </Pie>
            <Tooltip/>
            <Legend/>
        </PieChart>
        </ResponsiveContainer>
        </div>
       : <CircularProgress/>
      }
    </ChartWrapper>
  );
};

export default EventsByOs;
