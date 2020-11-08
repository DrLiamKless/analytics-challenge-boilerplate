import React, { useEffect, useState } from "react";
import { ChartWrapper, DatePickerWrapper } from "components/styled components/admin.styles";
import axios from 'axios'
import {Tooltip, Legend, Pie ,PieChart, Cell, ResponsiveContainer } from 'recharts'
import { CircularProgress, TextField } from "@material-ui/core";
import { monthAgo, monthAgoDate } from "helpers/helpers";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AAAAAA','#800080'];


const PageViews: React.FC<{}> = ({}) => {
    const [allUrlVisits, setAllUrlVisits] = useState<{url: string, count: number}[]>();
    const [dayZero, setDayZero] = useState<number>(monthAgo);

    useEffect( () => {
        fetchUrlViews(dayZero);
    }, [dayZero])

    const fetchUrlViews: (dayZero:number) => Promise<void> = async () => {
        const { data } = await axios({
          method: "get",
          url: `http://localhost:3001/events/chart/pageview/${dayZero}`,
        });
        const urlVisits = data;
        setAllUrlVisits(urlVisits);
      };

    const getDateDifferences = (dateTurltart:string):number => {

      if (new Date(dateTurltart).getTime() < Date.now()) {
        return  new Date(dateTurltart).getTime()
      } else return 0
    }

    const onEventChange = (dateTurltart:string) => {
      setDayZero(getDateDifferences(dateTurltart));
    }

 
  return (
    <ChartWrapper>
      <h3>Page Views</h3>
      <h5>Counts the amount of views per page</h5>
      { allUrlVisits ?
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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie 
                    data={allUrlVisits}
                    dataKey="count"
                    nameKey="url"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    fill="#8884d8"
                    label
                >
                {
                allUrlVisits.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }    
                </Pie>
                <Tooltip/>
                <Legend payload={
                  allUrlVisits.map(
                    (visit, index) => ({
                      id: visit.url,
                      type: "circle",
                      value: `${visit.url.split('3000/')[1]}`,
                      color: `${COLORS[index % COLORS.length]}`,
                    }))
                  }/>
            </PieChart>
          </ResponsiveContainer>
        </div>
       : <CircularProgress/>
      }
    </ChartWrapper>
  );
};

export default PageViews;
