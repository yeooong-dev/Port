import styled from "styled-components";
import Calendar from "react-calendar";

interface darkProps {
  darkMode: boolean;
}

export const CustomNavi = styled.div<darkProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75%;
  font-size: 1.8rem;
  margin-top: 30px;
  font-weight: bold;
  color: ${({ darkMode }) => (darkMode ? "#fff" : "#2e2e2e")};

  span {
    cursor: pointer;
  }

  button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    background: #fcfcfc;
    border-radius: 50%;
    margin: 0px 60px;
    color: #c2c2c2;
    cursor: pointer;
  }
`;

export const StyledCalendar = styled(Calendar)<darkProps>`
  width: 75%;
  background: ${({ darkMode }) => (darkMode ? "#4e5057" : "#fcfcfc")};
  margin-top: 50px;
  border-radius: 20px;

  .react-calendar__navigation {
    display: none;
  }

  .react-calendar__navigation button:first-child,
  .react-calendar__navigation button:last-child {
    display: none;
  }

  .react-calendar__tile.has-schedule {
    position: relative;
  }

  .has-schedule::after {
    content: "";
    display: block;
    width: 50px;
    height: 50px;
    background: red;
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    z-index: 99;
  }

  .react-calendar__month-view__weekdays__weekday {
    height: 50px;
    line-height: 50px;
    font-size: 1.3rem;
    border-bottom: 1px solid #dedede;
    font-weight: bold;
    border-radius: 0;
    background: ${({ darkMode }) => (darkMode ? "#323336" : "#d5dae3")};
    color: ${({ darkMode }) => (darkMode ? "white" : "#474747")};
  }
//323336
  .react-calendar__tile {
    position: relative;
    height: 120px;
    background-color: #f6f6f6;
    cursor: pointer;
    background: none;
    font-size: 1.1rem;
    border-bottom: 1px solid #dedede;
    color: ${({ darkMode }) => (darkMode ? "white" : "#2e2e2e")};
  }

  .react-calendar__tile--now {
    background-color: #51439d;
    color: #51439d;
    z-index: 0;
  }

  .react-calendar__month-view__weekdays {
    overflow: hidden;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  .react-calendar__month-view__days__day {
    border-right: 1px solid #dedede;
  }

  .react-calendar__month-view__days__day:nth-child(7),
  .react-calendar__month-view__days__day:nth-child(14),
  .react-calendar__month-view__days__day:nth-child(21),
  .react-calendar__month-view__days__day:nth-child(35),
  .react-calendar__month-view__days__day:nth-child(28),
  .react-calendar__month-view__days__day:nth-child(42) {
    border-right: none;
  }

  .react-calendar__month-view__days__day:nth-last-child(7),
  .react-calendar__month-view__days__day:nth-last-child(5),
  .react-calendar__month-view__days__day:nth-last-child(6),
  .react-calendar__month-view__days__day:nth-last-child(4),
  .react-calendar__month-view__days__day:nth-last-child(3),
  .react-calendar__month-view__days__day:nth-last-child(2),
  .react-calendar__month-view__days__day:nth-last-child(1) {
    border-bottom: none;
  }

  .react-calendar__tile {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 14px;
  }

  .react-calendar__year-view__months__month {
    height: auto;
  }

  .react-calendar__tile--now {
    background-color: transparent;
    color: #51439d;
    position: relative;
    font-weight: bold;
  }

  .react-calendar__month-view__days__day:nth-last-child(1) {
    border-bottom-right-radius: 20px;
  }
  .react-calendar__tile--now::before {
    content: "";
    position: absolute;
    top: 8px;
    right: 2px;
    width: 50px;
    height: 35px;
    background-color: #bccaee;
    border-radius: 20px;
    z-index: -1;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    background: ${({ darkMode }) => (darkMode ? "#323336" : "#f5f5f5")};
    color: ${({ darkMode }) => (darkMode ? "white" : "#cccccc")};
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
    color: ${({ darkMode }) => (darkMode ? "#2e2e2e" : "#e6e6e6")};
  }

  .year-modal-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 20px;
  }

  .year-button {
    margin: 10px;
    padding: 10px 20px;
    background-color: #f6f6f6;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .year-button:hover {
    background-color: #d5dae3;
  }
`;
