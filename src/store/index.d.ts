import * as R from './roleInfo'


type storeProps = {
   Rstore: R.RoleStoreType
}

declare type CompProps = {
    store: storeProps
    [key:string]:any
  
}
