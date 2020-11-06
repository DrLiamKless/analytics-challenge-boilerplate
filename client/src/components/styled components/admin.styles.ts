import styled, { createGlobalStyle } from 'styled-components';

export const AdminCard = styled.div`
    width: 100%;
    max-height: 100%;
    padding: 32px;
    margin-top: 80px;
    background: #ebfeff;
    border-radius: 10px;
    border: 2px solid #0085a3;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 20px;
    justify-content: center;

    h2 {
        position: absolute;
    }
`

export const ChartWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid black;
`

export const EventLogWrapper = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 50vw;
    height: 25vw;
    overflow-y: auto;
    overflow-x: auto;
    border: 1px solid black;
`

export const RetentionLogWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
`

export const MapWrapper = styled.div`
    width: 60vw;
    height: 35vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
`

export const FormWrapper = styled.div`
    max-width: 80%;
    height: 50%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
    justify-content: space-between;
    top: 0;
`

export const DatePickerWrapper = styled.div`
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const TableEmptySquare = styled.div`
    width: 80px;
    height: 60px;
    border: 1px solid #0085a3;
    background: #ffff;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
`

export const TableWrapper = styled.div`
width: 50vw;
height: 25vw;
overflow-y: auto;
overflow-x: auto;

th, td, tr {
    width: 80px;
    height: 60px;
    border: 1px solid #0085a3;
    background: #ffff;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}
`
