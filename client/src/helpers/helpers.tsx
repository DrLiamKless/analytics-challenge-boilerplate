import { number } from "yup"

export const createDefaultDateString = (timeStamp:number):string => {
    const date = new Date(timeStamp);
    let day = date.getDate().toString();
    day = day.length === 1 ? `0${day}` : `${day}`; 
    let month:string = date.getMonth().toString();
    month = month.length === 1 ? `0${month}` : `${month}`; 
    const year = date.getFullYear();


    return `${year}-${month}-${day}`
} 

export const now = Date.now();
export const month = 1000*60*60*24*31
export const monthAgo = now - month;
export const monthAgoDate = createDefaultDateString(monthAgo)
export const nowDate = createDefaultDateString(now);