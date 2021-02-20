import { observable, action } from "mobx";
import { createContext, useContext } from "react";
import Rstore from './roleInfo'

function createStores() {
  return {
    Rstore: new Rstore()
  };
}

const storeName = createStores();

const Stores = createContext(storeName);

// const useStores = () => useContext(StoresContext);

export { storeName, Stores };

