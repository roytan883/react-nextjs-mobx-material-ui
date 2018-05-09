import { action, observable } from 'mobx'

class Store {
  @observable isServer = false
  @observable name = "name-default"
  @observable age = 0
  @observable list = []

  @action init = (isServer, name, age) => {
    this.isServer = isServer
    this.name = name
    this.age = age
  }

  @action loadMoreList = (more) => {
    this.list = this.list.concat(more)
  }
}

const store = new Store()

export default store