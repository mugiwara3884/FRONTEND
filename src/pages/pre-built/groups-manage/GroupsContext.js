import React, { useState, createContext } from "react";

export const GroupsContext = createContext();

export const GroupsContextProvider = (props) => {
  console.log(props);

  return <GroupsContext.Provider value={{ contextData: [data, setData] }}>{props.children}</GroupsContext.Provider>;
};
